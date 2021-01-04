<template>
  <div class="comment">
    <div class="comment-content margin-bottom">
      <div class="comment-votes">
        <div class="comment-upvote">
          <img
            src="/images/thumb-up.png"
            width="24"
            height="24"
            :style="{
              backgroundColor: 'none'
            }"
          >
        </div>
        <div class="comment-score empty" />
        <div class="comment-downvote">
          <img
            src="/images/thumb-down.png"
            width="24"
            height="24"
            :style="{
              backgroundColor: 'none'
            }"
          >
        </div>
      </div>
      <div class="comment-text">
        <div class="comment-info margin-bottom empty" />
        <div class="comment-text margin-bottom empty" />
      </div>
    </div>
    <div
      v-if="subcomments && subcomments > 0"
      class="comment-indent"
    >
      <comment-lazyload
        v-for="i in subcomments"
        :key="i"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'comment-lazyload': () => import('./comment-lazyload')
  },
  props: {
    subcomments: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.margin-bottom {
  margin-bottom: 4px;
}

.comment-content {
  display: flex;
  flex-direction: row;
}

.comment-upvote, .comment-downvote {
  width: 24px;
  margin: 0 auto;
}

.comment-votes {
  padding-right: 16px;
  min-width: 64px;
}

.comment-score {
  height: 24px;
  width: 24px;

  text-align: center;
  margin: 0 auto;
}

.comment-info {
  height: 1.5em;
  width: 250px;
  margin-bottom: 8px;
}

.comment-text {
    height: 1.5em;
    width: 350px;
    margin-bottom: 8px;
}

.comment-indent {
  margin-left: 24px;
  padding-left: 16px;
  border-left: 1px solid #ffffff;
}

.empty {
  background-color: #EEEEEE;
  border-radius: 6px;
}
</style>
