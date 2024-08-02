<template>
    <div id="app">
      <CommentPlugin :scroll="true" :title="true" 
        :objectId="objectId" 
        :objectTitle = "objectTitle" 
        :objectType = "objectType"
        @login="login"
        :isLogin="isLogin"
        :senderFullName="senderFullName"
        :senderEmail="senderEmail"
        :senderPhoneNumber="senderPhoneNumber"
        />
    </div>
  </template>
  
  <script>
  export default {
   name: 'Comment',
   data() {
     return {
      // objectId: this.$route.query.objectId,
      objectId: 1,
      objectType: 1,
      objectTitle: 'Bài viết',
      objectUrl: window.location.href,
      isLogin: false,
      senderFullName: 'Adam Smith',
      senderEmail: 'adam@gmail.com',
      senderPhoneNumber: '0895619821'
     }
   },
   created() {
    // let cookie = this.$route.query.cookie;
    // console.log('ádasd',cookie);
   },
   methods: {
    login() {
      console.log('login');
      this.isLogin = true;
      this.senderFullName = 'John Doe';
      this.senderEmail = 'john@gmail.com';
      this.senderPhoneNumber = '0987654345';
    }
   }
  };
  </script>
  
  <style>
  #app {
    max-width: 750px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  