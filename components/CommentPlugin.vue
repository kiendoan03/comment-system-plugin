<template>
  <div class="comments container mt-5">
    <h2>Comments</h2>
    <div ref="commentsContainer" class="card mb-3 overflow-auto p-2" v-show="comments.length > 0" style="max-height: 400px;">
      <div v-for="comment in comments" :key="comment.id">
        <div class="card-body p-2">
          <div class="comment-header">
            <img :src="comment.authorImage" alt="Avatar" class="avatar">
            <div class="comment-details">
              <div class="card p-2" style="border-radius: 10px;">
                <p class="mb-1"><strong>{{ comment.authorName }}</strong></p>
                <div class="mb-1" :class="{ 'truncate': !comment.showFullContent }" v-html="formatContent(comment.content)" style="max-width: 300px;"></div>
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
        <textarea v-model="newComment.content" ref="CommentTextarea" placeholder="Your comment" required class="form-control" style="border-radius: 20px;"  @keydown="handleKeydown" @input="autoResize"></textarea>
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
import { format } from 'date-fns';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  name: 'CommentPlugin',
  data() {
    return {
      comments: [],
      newComment: {
        authorName: this.authorName,
        authorImage: this.authorImage,
        content: ''
      },
    };
  },
  props: {
    postId: {
      type: String,
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorImage: {
      type: String,
      required: true
    }
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
        const response = await this.$axios.get(`/api/Comments/${this.postId}`);
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
        const response = await this.$axios.post('/api/Comments', {
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
      return format(new Date(dateString), 'PPpp');
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
  max-width: 600px;
  margin: 0 auto;
}
.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Number of lines to show */
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
</style>
