<template>
    <div class="comment-list">
      <div v-for="comment in paginatedComments" :key="comment.date" class="comment">
        <img :src="getAvatar(comment.name)" alt="Avatar" class="avatar"/>
        <div class="comment-details">
          <h4>{{ comment.name }}</h4>
          <span>
            <i class="fa-regular fa-calendar"></i>
            {{ comment.date }}
        </span>
          <p>{{ comment.text }}</p>
        </div>
      </div>
      <div class="pagination">
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
  </template>
  
  <script>
  import '@fortawesome/fontawesome-free/css/all.min.css';

  export default {
    props: ['comments'],
    data() {
        return {
        currentPage: 1,
        commentsPerPage: 3, 
        maxVisiblePages: 5, 
        };
    },
    computed: {
        totalPages() {
        return Math.ceil(this.comments.length / this.commentsPerPage);
        },
        paginatedComments() {
        const start = (this.currentPage - 1) * this.commentsPerPage;
        const end = start + this.commentsPerPage;
        return this.comments.slice(start, end);
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
    methods: {
      getAvatar(name) {
        const initials = name.split(' ').map(word => word.charAt(0)).join('');
        return `https://ui-avatars.com/api/?name=${initials}&background=random`;
      },
      goToPage(page) {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .comment-list {
    margin-top: 20px;
  }
  .comment {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    /* border-bottom: 1px solid #ccc; */
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
    /* background-color: #f4f4f4; */
    border-radius: 5px;
    padding: 10px;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
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
  </style>
  