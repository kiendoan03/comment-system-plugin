<template>
    <div class="comment-container">
        <div class="comment-form">
          <div class="title" v-if="title">
            <h2>Bình luận</h2>
            <div class="separator"></div>
          </div>
          <textarea 
            v-show="!overlay" 
            @click="handelClick" 
            :class="{ inValid : $v.form.content.$error}"  
            @keydown="(isLogin || anonymous) ? handleKeydown($event) : handelClick()" 
            rows="4" 
            v-model="form.content" 
            class="custom-scroll m-0" 
            placeholder="Ghi bình luận tại đây"
          >
          </textarea>
          <b class="error" v-if="$v.form.content.$error">Vui lòng nhập nội dung bình luận</b>
          <div class="overlay" v-show="overlay">
            <div class="container">
                <span 
                  class="close-btn"  
                  @click="overlay = false"
                >
                  <i class="fa-solid fa-xmark fa-sm"></i>
                </span>
                <button class="login-btn" @click="login">Đăng nhập</button>
                <span  
                  @click="anonymous = true; overlay = false; getCaptcha()" 
                  class="comment-link"
                >
                  Bình luận mà không cần đăng nhập?
                </span>
            </div>
          </div>
          <div class="input-group mt-2" v-if="anonymous">
            <div class="input-item">
              <input 
                v-model="form.senderFullName" 
                :class="{ inValid : $v.form.senderFullName.$error}"  
                type="text" 
                placeholder="Họ và tên" 
              />
              <b class="error" v-if="$v.form.senderFullName.$error">Vui lòng nhập họ và tên</b>
            </div>
            <div class="input-item">
              <input 
                v-model="form.senderPhoneNumber" 
                :class="{ inValid : $v.form.senderPhoneNumber.$error}" 
                type="text" 
                placeholder="Số điện thoại" 
              />
              <b class="error" v-if="$v.form.senderPhoneNumber.$error">Vui lòng nhập số điện thoại</b>
            </div>
            <div class="input-item">
              <input 
                v-model="form.senderEmail" 
                :class="{ inValid : $v.form.senderEmail.$error}" 
                type="email" 
                placeholder="Email" 
              />
              <b class="error" v-if="$v.form.senderEmail.$error">Vui lòng nhập email hợp lệ</b>
              <!-- <b class="error" v-if="$v.form.senderEmail.$invalid">Email không hợp lệ</b> -->
            </div>
          </div>
          <div class="captcha input-group mb-2" v-show="anonymous">
            <div class="captcha-item">
              <input 
                type="text" 
                class="mb-2" 
                :class="{ inValid : $v.form.captcha.$error}" 
                placeholder="MÃ XÁC THỰC" 
                @keyup.enter="submitComment"  
                v-model="form.captcha" 
                required  
              />
              <div class="error" v-if="$v.form.captcha.$error"><b>Vui lòng nhập mã xác thực</b></div>
              <div class="error" v-if="inValidCaptcha"><b>{{ inValidCaptchaMessage }}</b></div>
            </div>
            <div class="captcha-item">
              <img id="img-captcha" :src="imgCaptcha"/>
                <span
                  id="reloadCaptcha"
                  title="Đổi mã mới"
                  @click="getCaptcha()"
                  style="cursor: pointer; margin-left: 5px;"
                >
                  <i class="fa-solid fa-rotate fa-xl"></i>
                </span>
            </div>
          </div>
          <div class="button-container" v-if="isLogin || anonymous">
            <div v-show="isLogin" class="comment p-0 mb-0" style="margin-right: 10px">
              <img :src="getAvatar(this.senderFullName)" alt="Avatar" class="avatar" style="height: 35px; width: 35px; margin-right: 5px;"/>
              <div class="comment-details">
                <span>{{ this.senderFullName }}</span>
              </div>
            </div>
            <button @click="submitComment">Gửi bình luận</button>
          </div>
        </div>
        <div class="comment-list custom-scroll" ref="commentsContainer" :class="{ scroll: scroll }">
        <div v-for="comment in (scroll ? comments : paginatedComments)" :key="comment.createdAt" class="comment">
            <img :src="getAvatar(comment.senderFullName)" alt="Avatar" class="avatar"/>
            <div class="comment-details">
            <h4>{{ comment.senderFullName }}</h4>
            <span>
                <i class="fa-regular fa-calendar" style="margin-right: 2px;"></i>
                {{ formatDate(comment.createdDate) }}
            </span>
            <p :id="'content-' + comment.id" v-html="formatContent(comment.content)" ></p>
            <b class="text-dark" v-if="comment.showFullContent != null" style="cursor: pointer;" @click.prevent="toggleContent(comment)">
                  {{ comment.showFullContent ? 'Ẩn bớt' : 'Xem thêm' }}
                </b>
            </div>
        </div>
        <div class="pagination" v-if="!scroll">
            <button
                @click="goToPage(1)"
                :disabled="currentPage === 1"
                class="page-button"
            >
                <i class="fa-solid fa-angles-left"></i>
            </button>
            <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="page-button"
            >
                <i class="fa-solid fa-angle-left"></i>
            </button>
            <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="{ active: currentPage === page }"
                class="page-button"
            >
                {{ page }}
            </button>
            <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="page-button"
            >
                <i class="fa-solid fa-angle-right"></i>
            </button>
            <button
                @click="goToPage(totalPages)"
                :disabled="currentPage === totalPages"
                class="page-button"
            >
                <i class="fa-solid fa-angles-right"></i>
            </button>
            </div>
        </div>  
    </div>
  </template>
  
  <script>
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import moment from 'moment-timezone';
    import axios from 'axios';
    import 'vuelidate';
    import { required, email } from 'vuelidate/lib/validators';

  export default {
    props:{
        scroll: {
            type: Boolean,
            default: false,
        },
        title: {
            type: Boolean,
            default: true,
        },
        objectId: {
            type: Number,
            default: null,
        },
        objectType: {
            type: Number,
            default: null,
        },
        objectTitle: {
            type: String,
            default: null,
        },
        objectUrl: {
            type: String,
            default: window.location.href,
        },
        isLogin: {
            type: Boolean,
            default: false,
        },
        senderFullName: {
            type: String,
            default: null,
        },
        senderEmail: {
            type: String,
            default: null,
        },
        senderPhoneNumber: {
            type: String,
            default: null,
        },
    },
    data() {
      return {
        comments: [],
        form: {
          content: '',
          senderFullName: '',
          senderPhoneNumber: '',
          senderEmail: '',
          objectId: this.objectId,
          objectType: this.objectType,
          objectTitle: this.objectTitle,
          objectUrl: this.objectUrl,
          captcha: null,
          md5Captcha: null,
        },
        imgCaptcha:'',
        currentPage: 1,
        commentsPerPage: 3, 
        maxVisiblePages: 5, 
        paginated_comments: [],
        anonymous: false,
        overlay: false,
        inValidCaptcha: false,
        inValidCaptchaMessage: '',
      };
    },
    validations: {
        form: {
          content: { required },
          senderFullName: { required },
          senderEmail: { required, email },
          senderPhoneNumber: { required },
          captcha: { required },
        },
    },
    computed: {
        totalPages() {
        return Math.ceil(this.comments.length / this.commentsPerPage);
        },
        paginatedComments() {
          const start = (this.currentPage - 1) * this.commentsPerPage;
          const end = start + this.commentsPerPage;
          this.paginated_comments = this.comments.slice(start, end);
          return this.paginated_comments;
        },
        visiblePages() {
        const pages = [];
        const half = Math.floor(this.maxVisiblePages / 2);

        let start = Math.max(this.currentPage - half, 1);
        let end = Math.min(start + this.maxVisiblePages - 1, this.totalPages);

        if (end - start < this.maxVisiblePages - 1) {
            start = Math.max(end - this.maxVisiblePages + 1, 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
        },
    },
    watch: {
        paginated_comments() {
          this.checkPaginationComment();
        },
    }, 
    async created() {
        await this.fetchComments();
        // console.log(document.cookie);
    },
    methods: {
      login() {
        this.$emit('login');
        this.overlay = false;
      },
      handelClick() {
        if(this.isLogin || this.anonymous) {
          return;
        }else{
          this.overlay = true;
        }
      },
      handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.submitComment();
        }
      },
       async fetchComments() {
        try {
            // const response = await axios.get(`https://localhost:7000/api/Comments`);
            const response = await axios.get(`https://localhost:7000/api/Comments/get-comments-by-objectId-and-objectUrl?objectId=` + this.objectId + `&objectUrl=` + this.objectUrl);
            this.comments = response.data;
            if(this.scroll) {
              this.$nextTick(() => {
                this.comments.forEach(comment => {
                  const content = document.getElementById(`content-${comment.id}`);
                  if (content) {
                    if (content.clientHeight > 72) {
                      this.$set(comment, 'showFullContent', false);
                      content.classList.add('truncate');
                    }else{
                      this.$set(comment, 'showFullContent', null);
                    }
                  } else {
                    console.warn(`Element with ID content-${comment.id} not found.`);
                  }
                });
              });
            }
            if(!this.scroll) {
              this.comments = this.comments.reverse();
            }else{
              this.$nextTick(() => {
                this.scrollToBottom();
              });
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
      },
      formatDate(dateString) {
        return moment.utc(dateString).tz('Asia/Ho_Chi_Minh').format('MMMM D, YYYY h:mm A');
      },
      formatContent(content) {
        return content.replace(/\n/g, '<br>');
      },
      checkTruncate(comment) {
        return comment.content.split('\n').length > 3;
      },
      toggleContent(comment) {
        comment.showFullContent = !comment.showFullContent;
        if(comment.showFullContent) {
          document.getElementById(`content-${comment.id}`).classList.remove('truncate');
        }else{
          document.getElementById(`content-${comment.id}`).classList.add('truncate');
        }
      },
      checkPaginationComment() {
          this.paginated_comments.forEach(comment => {
            const content = document.getElementById(`content-${comment.id}`);
            if (content) {
              if (content.clientHeight > 72) {
                this.$set(comment, 'showFullContent', false);
                content.classList.add('truncate');
              }
            } else {
              console.warn(`Element with ID content-${comment.id} not found.`);
            }
          });
        },
      getAvatar(name) {
        const initials = name.split(' ').map(word => word.charAt(0)).join('');
        return `https://ui-avatars.com/api/?name=${initials}&background=random`;
      },
      goToPage(page) {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
        }
      },
      scrollToBottom() {
        const container = this.$refs.commentsContainer;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      },
      getCaptcha() {
        axios.get('https://localhost:7000/api/Comments/get-captcha')
              .then((response) => {
                    this.form.captcha = '';
                    this.imgCaptcha = response.data.responseData.captcha;
                    this.form.md5Captcha = response.data.responseData.content;
           }).catch((err) => {});
        },
        checkValidForm(){
          if(this.anonymous) {
            this.$v.$touch();
            return !this.$v.$invalid;
          }else{
            this.$v.form.content.$touch();
            return !this.$v.form.content.$error;
          }
        },
      async submitComment() {
        if(this.checkValidForm()){
          try {
             if(this.isLogin){
              this.form.senderFullName = this.senderFullName;
              this.form.senderEmail = this.senderEmail;
              this.form.senderPhoneNumber = this.senderPhoneNumber;
              }
                  const response = await axios.post('https://localhost:7000/api/Comments', this.form);
                  if(this.anonymous && response.data.statusCode == 400) {
                    this.inValidCaptcha = true;
                    this.inValidCaptchaMessage = response.data.message;
                    this.getCaptcha();
                    this.$v.form.$reset();
                    return;
                  }
                  const comment = response.data;
                  if(this.scroll) {
                    this.comments.push(comment);
                    this.$nextTick(() => {
                      this.scrollToBottom();
                      const content = document.getElementById(`content-${comment.id}`);
                      if (content) {
                        if (content.clientHeight > 72) {
                          this.$set(comment, 'showFullContent', false);
                          content.classList.add('truncate');
                        }else{
                          this.$set(comment, 'showFullContent', null);
                        }
                      } else {
                        console.warn(`Element with ID content-${comment.id} not found.`);
                      }
                      });
                  }else{
                    this.comments = [comment, ...this.comments];
                  }
              } catch (error) {
                  console.error('Error adding comment:', error);
              }
            this.form.content = '';
            // this.form.senderFullName = '';
            // this.form.senderPhoneNumber = '';
            // this.form.senderEmail = '';
            this.form.captcha = null;
            this.form.md5Captcha = null;
            this.inValidCaptcha = false;
            this.$v.form.$reset();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .error{
    color: red;
    font-size: 12px;
  }

  .inValid {
    border: 1px solid red;
  }

  .captcha-item .inValid {
    border: 1px solid red;
  }

  .input-item .inValid {
    border: 1px solid red;
  }

  .comment-form {
    margin-bottom: 20px;
  }

  .scroll {
    max-height: 400px;
    overflow-y: auto;
  }
  
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    position: relative;
  }
  
  .separator {
    height: 2px;
    background-color: #5176f8;
    margin-bottom: 10px;
    width: 100%;
  }
  
  textarea {
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    resize: none;
  }

  .truncate {
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .input-item {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .input-item input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }

  .captcha-item input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
  }

  button {
    background-color: #6ca6fd;
    color: white;
    padding: 7px 15px;
    border: none;
    cursor: pointer;
    border-radius: 7px;
  }

  button:hover {
    background-color: #5497fc;
  }

  .comment-list {
    margin-top: 20px;
    padding: 0 10px;
  }
  .comment {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    padding-bottom: 10px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .comment-details {
    flex: 1;
  }
  .comment-details h4 {
    margin: 0;
  }
  .comment-details span {
    font-size: 0.8em;
    color: gray;
  }
  .comment-details p {
    margin: 5px 0 0;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 5px;
    padding: 10px;
    }

    .page-button {
    background-color: white;
    border: 1px solid #ddd;
    color: #333;
    padding: 5px 10px;
    margin: 0 2px;
    cursor: pointer;
    border-radius: 3px;
    min-width: 35px;
    text-align: center;
    transition: background-color 0.3s, color 0.3s;
    }

    .page-button:disabled {
    color: #aaa;
    cursor: not-allowed;
    background-color: #f4f4f4; 
    }

    .page-button.active {
    background-color: #e7ecf7; 
    color: #305af8; 
    font-weight: bold;
    border-color: #e7ecf7;
    }

    .page-button:hover:not(:disabled) {
    background-color: #d9e4f5;
    color: #305af8;
    }

    
.custom-scroll {
  overflow-y: auto;
  margin: 0 5px;
}

.custom-scroll::-webkit-scrollbar {
  width: 10px; 
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #919191; 
  border-radius: 10px; 
  height: 50px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #616161; 
}

.custom-scroll::-webkit-scrollbar-track:hover {
  background: #f1f1f1; ; 
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent; 
  border-radius: 10px; 
}

.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.9);
    border-radius: 5px;
    position: relative;
}

.container {
    background-color: #b1b1b1;
    padding: 20px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.comment-link {
    margin-top: 10px;
    color: #ffffff;
    text-decoration: none;
}

.comment-link:hover {
    text-decoration: underline;
    cursor: pointer;
}

.close-btn {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
    color: #ffffff;
}

.close-btn:hover {
    color: #ff0000;
}
</style>
  