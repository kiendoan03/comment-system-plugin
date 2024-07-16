<template>
    <CommentPlugin :postId = 'postId' :authorName='authorName' :authorImage='authorImage' />
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      postId: '1',
      authorName: 'John Doe',
      authorImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjS_NU2XdsQGXCKNNZAL7beU5NNCvh1UMk7Q&s'
    };
  },
}
</script>
