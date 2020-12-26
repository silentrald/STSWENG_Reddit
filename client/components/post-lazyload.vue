<template>
  <div class="post">
    <vote-lazyload direction="col" />
    <div class="post-text">
      <div class="post-info empty" />
      <div class="post-title empty" />
      <div class="post-preview empty" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.post {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px 16px;

  display: flex;
}

.post-votes {
  padding-right: 16px;
  min-width: 64px;
}

.post-info {
  height: 1.5em;
  width: 250px;
  margin-bottom: 8px;
}

.post-title {
  height: 1.5em;
  width: 150px;
  margin-bottom: 8px;
}

.post-preview {
  height: 18em;
  width: 500px;
  margin-bottom: 8px;
}

.post-upvote, .post-downvote {
  width: 24px;
  margin: 0 auto;
}

.post-score {
  height: 24px;
  width: 24px;

  text-align: center;
  margin: 0 auto;
}

.empty {
  background-color: #EEEEEE;
  border-radius: 6px;
}

</style>
