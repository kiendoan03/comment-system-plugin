<template>
  <div class="comments card pt-3" :style="'max-width: ' + width + 'px'">
    <!-- <h2>Comments</h2> -->
    <div ref="commentsContainer" class="mb-3 overflow-auto p-2 custom-scroll" v-show="comments.length > 0" :style="'max-height : ' + height + 'px'">
      <div v-for="comment in comments" :key="comment.id">
        <div class="card-body p-2">
          <div class="comment-header">
            <img :src="comment.authorImage" alt="Avatar" class="avatar">
            <div class="comment-details">
              <div class="card p-2" style="border-radius: 20px;">
                <p class="mb-0"><strong>{{ comment.authorName }}</strong></p>
                <div class="mb-0" :class="{ 'truncate': !comment.showFullContent }" v-html="formatContent(comment.content)" :style="'max-width:' + (parseInt(width) - 140) + 'px'">
                </div>
                <b v-if="checkTruncate(comment) || comment.content.length > 100" class="text-dark" style="cursor: pointer;" @click.prevent="toggleContent(comment)">
                  {{ comment.showFullContent ? 'Ẩn bớt' : 'Xem thêm' }}
                </b>
              </div>
              <div class="comment-time">
                <span>{{ formatDate(comment.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="addComment" class="mb-4 d-flex align-items-center">
      <img :src="authorImage" alt="Avatar" class="avatar mx-2">
      <div class="input-group">
        <textarea v-model="newComment.content" ref="CommentTextarea" :placeholder="placeholder" required class="form-control" style="border-radius: 20px;"  @keydown="handleKeydown" @input="autoResize"></textarea>
        <div class="input-group-append">
          <button type="submit" class="btn">
            <i class="fa-solid fa-paper-plane lg"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import { format } from 'date-fns';
import moment from 'moment-timezone';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  name: 'CommentPlugin',
  props: {
    postId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
      required: true,
    },
    height:{
      type: String,
      default: '500',
    },
    width:{
      type: String,
      default: '800',
    },
    placeholder: {
      type: String,
      default: 'Viết bình luận...',
    },
  },
  data() {
    return {
      comments: [],
      newComment: {
        authorName: '',
        authorImage: '',
        content: ''
      },
    };
  },
  mounted() {
    this.newComment.authorName = this.authorName;
    this.newComment.authorImage = this.authorImage;
  },
  async created() {
    await this.fetchComments();
  },
  methods: {
    checkTruncate(comment) {
      return comment.content.split('\n').length > 3;
    },
    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.addComment();
      }
    },
    async fetchComments() {
      try {
        const response = await axios.get(`https://localhost:7031/api/Comments/${this.postId}`);
        this.comments = response.data;
        this.comments.forEach(comment => {
          this.$set(comment, 'showFullContent', false); 
        });
        this.$nextTick(() => {
            this.scrollToBottom();
          });

      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.commentsContainer;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    },
    async addComment() {
      const trimmedContent = this.newComment.content.trim();
      if (!trimmedContent) {
        console.log('Comment content is empty or whitespace.'); 
        return;
      }
      try {
        const response = await axios.post('https://localhost:7031/api/Comments', {
          ...this.newComment,
          postId: this.postId
        });
        const comment = response.data;
        this.$set(comment, 'showFullContent', false); 
        this.comments.push(comment);
        this.newComment.content = '';
        this.$nextTick(() => {
          this.scrollToBottom();
          this.$refs.CommentTextarea.style.height = '38px';
        });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    formatDate(dateString) {
      return moment.utc(dateString).tz('Asia/Ho_Chi_Minh').format('MMMM D, YYYY h:mm A');
    },
    formatContent(content) {
      return content.replace(/\n/g, '<br>');
    },
    autoResize(event) {
      const textarea = event.target;
      textarea.style.height = 'auto';
      if (textarea.value) {
        textarea.style.height = textarea.scrollHeight + 'px';
      } else {
        textarea.style.height = '38px';
      }
      const maxHeight = 200; 
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden'; 
      }
    },
    toggleContent(comment) {
      comment.showFullContent = !comment.showFullContent;
    }
  }
};
</script>

<style scoped>
textarea.form-control {
  height: 38px;
  overflow: hidden;
  resize: none; 
}
.comments {
  border-radius: 20px;
}
.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

h2 {
  text-align: left;
  margin-bottom: 20px;
  color: #333;
}

.comment-card {
  border: none;
  border-bottom: 1px solid #ddd;
  border-radius: 0;
}

.comment-header {
  display: flex;
  align-items: flex-start;
}

.comment-details {
  margin-left: 10px;
  flex: 1;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-time {
  color: #999;
}

.form-group {
  display: flex;
  align-items: center;
}

.input-group {
  flex: 1;
  display: flex;
}

.input-group textarea {
  flex: 1;
  resize: none;
}

.input-group-append {
  display: flex;
  align-items: center;
}

.input-group-append .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
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
  height: 100px;
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
</style>
