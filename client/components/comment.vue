<template>
  <div class="comment">
    <div class="comment-content margin-bottom">
      <div class="comment-votes">
        <comment-vote
          :id="id"
          :score="score"
          direction="col"
        />
      </div>
      <div class="comment-text width-100">
        <div class="comment-info margin-bottom">
          Commented by {{ author }} on {{ formatDate(date) }}
        </div>
        <div class="comment-text margin-bottom">
          {{ text }}
        </div>
        <div
          v-if="$auth.user"
          class="reply"
          @click="showSubcomment()"
        >
          Reply
        </div>
        <div v-if="$auth.user && writeSubcomment">
          <textarea
            v-model="tempSubcomment"
            class="subcomment-input"
            maxlength="1000"
          />
          <button class="send" @click="postSubcomment()">
            SEND
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="subcomments && subcomments.length > 0"
      class="comment-indent"
    >
      <!-- TODO: Implement See More comments -->
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
    },
    tempSubcomment: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      writeSubcomment: false
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    },

    showSubcomment () {
      this.writeSubcomment = true
    },

    async postSubcomment () {
      this.tempSubcomment = this.tempSubcomment.trim()
      if (!this.tempSubcomment) { return }

      const { station, post } = this.$route.params

      try {
        const res = await this.$axios.post('/api/subcomment/create', {
          parentPost: post,
          parentComment: this.id,
          text: this.tempSubcomment,
          station
        })
        const { subcomment } = res.data
        // TODO: Fix mutation problem
        this.subcomments.push(subcomment)
        this.writeSubcomment = false
      } catch (err) {}
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

.reply {
  color: #dddddd;
  cursor: pointer;
  width: max-content;
}

.width-100 {
  width: 100%;
}

.subcomment-input {
  width: 100%;
  resize: none;
}

textarea, textarea:focus {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

textarea:focus {
  box-shadow: none;
}

.send {
  outline: none;
  border: none;
  float: right;
}
</style>
