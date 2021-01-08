<template>
  <div class="post">
    <div class="post-text">
      <div class="post-info margin-bottom empty" />
      <div class="post-title margin-bottom empty" />
      <div class="post-preview margin-bottom empty" />
    </div>
    <post-vote-lazyload direction="row" />
    <div class="post-comments">
      <!-- -->
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.margin-bottom {
  margin-bottom: 12px;
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

.empty {
  background-color: #EEEEEE;
  border-radius: 6px;
}
</style>
