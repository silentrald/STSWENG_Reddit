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
              // TODO: change this
              backgroundColor: 1 === 1 ? 'green' : 'none'
            }"
          >
        </div>
        <div class="comment-score">
          {{ score }}
        </div>
        <div class="comment-downvote">
          <img
            src="/images/thumb-down.png"
            width="24"
            height="24"
            :style="{
              // TODO: change this
              backgroundColor: -1 === -1 ? 'red' : 'none'
            }"
          >
        </div>
      </div>
      <div class="comment-text">
        <div class="comment-info margin-bottom">
          Commented by {{ author }} on {{ formatDate(date) }}
        </div>
        <div class="comment-text margin-bottom">
          {{ text }}
        </div>
      </div>
    </div>
    <div
      v-if="subcomments && subcomments.length > 0"
      class="comment-indent"
    >
      <comment
        v-for="subcomment in subcomments"
        :id="subcomment.comment_id"
        :key="subcomment.id"
        :text="subcomment.text"
        :score="subcomment.score"
        :date="subcomment.timestamp_created"
        :author="subcomment.author"
        :subcomments="subcomment.subcomments || []"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {
    comment: () => import('./comment')
  },

  props: {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    author: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    subcomments: {
      type: Array,
      required: true
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
  text-align: center;
}

.comment-info {
  font-size: 0.75rem;
  color: #aaaaaa;
}

.comment-indent {
  margin-left: 24px;
  padding-left: 16px;
  border-left: 1px solid #ffffff;
}
</style>
