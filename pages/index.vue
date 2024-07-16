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
      authorImage: 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg'
    };
  },
}
</script>
