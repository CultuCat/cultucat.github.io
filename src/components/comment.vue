<template>
  <div class="comment">
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-username">{{ comment.username }}</span>
        <span class="comment-timestamp">{{ transformDate(comment.created_at) }}</span>
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
  methods: {
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short", // Short weekday format (e.g., Sat)
        month: "short", // Long month format (e.g., Oct)
        day: "numeric", // Numeric day format (e.g., 22)
        hour: "numeric", // Numeric hour format (e.g., 14)
        minute: "numeric", // Numeric minute format (e.g., 00)
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
    },
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
