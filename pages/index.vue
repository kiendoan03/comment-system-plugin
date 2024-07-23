<template>
  <div class="mt-5">
    <!-- <comment-plugin :postId="postId" :authorName="authorName" :authorImage="authorImage"></comment-plugin> -->
    <!-- <comment-plugin :post-id="postId" :author-name="authorName" :author-image="authorImage"></comment-plugin> -->
    <!-- <comment-plugin post-id="123" author-name="John Doe" author-image="/path/to/image.jpg"></comment-plugin> -->
    <CommentPlugin class="mx-auto" :postId="postId" :authorName="authorName" :authorImage="authorImage" placeholder="Your comment..." width= "900" height= "500" />
  </div>
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
};
</script>
