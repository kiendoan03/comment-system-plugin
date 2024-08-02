<template>
    <div class="comment-form">
      <h2>Bình luận</h2>
      <div class="separator"></div>
      <textarea v-model="commentText" placeholder="Ghi bình luận tại đây"></textarea>
      <div class="input-group">
        <input v-model="name" type="text" placeholder="Họ và tên" />
        <input v-model="phone" type="text" placeholder="Số điện thoại" />
        <input v-model="email" type="email" placeholder="Email" />
      </div>
      <div class="button-container">
        <button @click="submitComment">Gửi bình luận</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        commentText: '',
        name: '',
        phone: '',
        email: '',
      };
    },
    methods: {
      submitComment() {
        if (this.commentText && this.name && this.email) {
          this.$emit('submit-comment', {
            text: this.commentText,
            name: this.name,
            phone: this.phone,
            email: this.email,
            date: new Date().toLocaleString(),
          });
          this.commentText = '';
          this.name = '';
          this.phone = '';
          this.email = '';
        } else {
          alert('Vui lòng điền đầy đủ thông tin!');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .comment-form {
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    position: relative;
  }
  
  .separator {
    height: 2px;
    /* background-color: #f58220; */
    background-color: #305af8;
    margin-bottom: 10px;
    width: 100%;
  }
  
  textarea {
    width: 100%;
    height: 120px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    resize: none;
  }
  
  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .button-container {
    display: flex;
    justify-content: flex-end;
 }

  button {
    /* background-color: #8a1313; */
    background-color: #6ca6fd;
    color: white;
    padding: 7px 15px;
    border: none;
    cursor: pointer;
    border-radius: 7px;
  }

  button:hover {
    /* background-color: #a31515; */
    background-color: #5497fc;
  }
</style>
  