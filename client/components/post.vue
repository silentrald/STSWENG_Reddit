<template>
  <div class="post">
    <div class="post-votes">
      <div class="post-upvote">
        <img src="/images/thumb-up.png" width="24" height="24">
      </div>
      <div class="post-score">
        999
      </div>
      <div class="post-downvote">
        <img src="/images/thumb-down.png" width="24" height="24">
      </div>
    </div>
    <div class="post-text">
      <div class="post-info">
        Posted by u/someone on November 18, 2020
      </div>
      <div class="post-title">
        This is the post title
      </div>
      <div class="post-preview">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nam quibusdam impedit.
        Accusamus, eum maxime fugit ullam, iure impedit voluptatem ipsum laboriosam delectus tempora
        blanditiis exercitationem perferendis doloribus obcaecati dicta?
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
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
  font-size: 0.75rem;
  color: #aaaaaa;
}

.post-title {
  font-size: 1.5em;
  font-weight: 500;
}

.post-upvote, .post-downvote {
  width: 24px;
  margin: 0 auto;
}

.post-score {
  text-align: center;
}

</style>
