<template>
    <div class="comment">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-username">{{ comment.username }}</span>
          <span class="comment-timestamp">{{ comment.time }}</span>
        </div>
        <div class="comment-text">{{ comment.text }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      comment: Object,
    },
  };
  </script>
  
  <style scoped>
  .comment {
    display: flex;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  .comment-avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .comment-content {
    flex: 1 1 auto;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
  }
  
  .comment-username {
    font-weight: bold;
  }
  
  .comment-timestamp {
    color: #777;
  }
  
  .comment-text {
    margin-top: 5px;
  }
  </style>
  