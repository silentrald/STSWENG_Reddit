<template>
  <div class="post" @click="toPost()">
    <div class="post-votes">
      <div class="post-upvote">
        <img
          src="/images/thumb-up.png"
          width="24"
          height="24"
          :style="{
            // TODO: change this
            backgroundColor: vote === 1 ? 'green' : 'none'
          }"
        >
      </div>
      <div class="post-score">
        {{ score }}
      </div>
      <div class="post-downvote">
        <img
          src="/images/thumb-down.png"
          width="24"
          height="24"
          :style="{
            // TODO: change this
            backgroundColor: vote === -1 ? 'red' : 'none'
          }"
        >
      </div>
    </div>
    <div class="post-text">
      <div class="post-info">
        Posted by /u/{{ author }} on {{ formatDate(date) }}
      </div>
      <div class="post-title">
        {{ title }}
      </div>
      <div class="post-preview">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    vote: {
      type: Number,
      default: 0 // 0 not voted, 1 is up, -1 is down
    },
    author: {
      type: String,
      default: 'anonymous'
    },
    date: {
      type: String,
      default: 'no date'
    },
    title: {
      type: String,
      default: ''
    },
    station: {
      type: String,
      default: ''
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    },

    toPost () {
      this.$router.push(`/s/${this.station}/post/${this.id}`)
    }
  }
}
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
