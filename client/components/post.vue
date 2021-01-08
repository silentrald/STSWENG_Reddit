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
    <post-vote
      :id="id"
      :score="score"
      direction="row"
    />
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

.post-title {
  font-size: 1.5em;
  font-weight: 500;
}
</style>
