<template>
  <div class="post">
    <div class="post-text">
      <div class="post-info margin-bottom">
        Posted by /u/{{ author }} on {{ formatDate(date) }}
      </div>
      <div class="post-title margin-bottom">
        {{ title }}
      </div>
      <div class="post-preview margin-bottom">
        <remark>
          <slot />
        </remark>
      </div>
    </div>
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
    <div class="post-comments">
      <!-- -->
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
    station: {
      type: String,
      default: 'sample'
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
    }
  },

  data () {
    return {
      comments: {}
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    }
  }
}
</script>

<style scoped>
.margin-bottom {
  margin-bottom: 12px;
}

.post-info {
  font-size: 0.75rem;
  color: #aaaaaa;
}

.station-link {
  font-size: 18px;
  color: white;
  text-decoration: none;
}

.post-title {
  font-size: 1.5em;
  font-weight: 500;
}

.post-votes {
  display: flex;
  justify-content: flex-end;
  background-color: #ffffff1a; /* 10% opacity */
  padding: 0.5rem;
  border-radius: 10px;
}

.post-upvote, .post-downvote {
  width: 24px;
}

.post-score {
  text-align: center;
  margin: 0 8px;
}

</style>
