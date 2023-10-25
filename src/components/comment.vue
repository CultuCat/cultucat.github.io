<template>
    <div class="comment">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-username">{{ username }}</span>
          <span class="comment-timestamp">{{ time }}</span>
        </div>
        <div class="comment-text">{{ text }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      username: String,
      time: String,
      text: String,
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
  