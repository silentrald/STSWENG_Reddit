<template>
  <div class="comment">
    <div class="comment-content margin-bottom">
      <div class="comment-votes">
        <comment-vote
          :id="id"
          :score="score"
          :disabled="isDeleted"
          direction="col"
        />
      </div>
      <div class="comment-text width-100">
        <div class="comment-info margin-bottom">
          Commented by
          <span v-if="!isDeleted">
            <nuxt-link :to="`/u/${author}`">/u/{{ author }}</nuxt-link>
          </span>
          <span v-else>
            /u/deleted
          </span>
          on {{ formatDate(date) }}
        </div>
        <div v-if="editting">
          <div class="d-flex">
            <textarea v-model="editText" class="w-100" />
          </div>
          <button class="float-right mt-2 ml-2" @click="saveEdit()">
            SAVE
          </button>
          <button class="float-right mt-2 red" @click="cancelEditting()">
            CANCEL
          </button>
        </div>
        <div v-else class="comment-text margin-bottom">
          <div v-if="!isDeleted">
            {{ commentText }}
          </div>
          <div v-else>
            [deleted]
          </div>
        </div>
        <div v-if="!isDeleted && !editting && !writeSubcomment" class="d-flex">
          <div
            v-if="$auth.user"
            class="reply mr-4"
            @click="showSubcomment()"
          >
            Reply
          </div>
          <div
            v-if="$auth.user && $auth.user.username === author"
            class="reply mr-4"
            @click="editSubcomment()"
          >
            Edit
          </div>
          <div
            v-if="$auth.user && $auth.user.username === author"
            class="reply mr-4"
            @click="deleteSubcomment()"
          >
            Delete
          </div>
        </div>
        <div v-if="$auth.user && writeSubcomment">
          <div
            v-if="subcommentError !== undefined"
            class="red"
          >
            {{ subcommentError }}
          </div>
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
        :deleted="subcomment.deleted"
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
    deleted: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      commentText: '',
      writeSubcomment: false,
      tempSubcomment: '',
      editting: false,
      saving: false,
      editText: '',
      isDeleted: false,
      sending: false,
      subcommentError: undefined
    }
  },

  beforeMount () {
    this.commentText = this.text
    this.isDeleted = this.deleted
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    },

    showSubcomment () {
      this.writeSubcomment = true
    },

    editSubcomment () {
      this.editText = this.commentText
      this.editting = true
    },

    async deleteSubcomment () {
      try {
        await this.$axios.delete(`/api/comment/${this.id}`)
        this.isDeleted = true
        this.commentText = '[deleted]'
      } catch (_err) {}
    },

    async saveEdit () {
      if (this.saving) { return }
      this.saving = true

      try {
        await this.$axios.patch(`/api/comment/${this.id}`, {
          text: this.editText
        })

        this.commentText = this.editText
        this.editting = false
      } catch (_err) {}
      this.saving = false
    },

    cancelEditting () {
      this.editText = ''
      this.editting = false
    },

    async postSubcomment () {
      this.tempSubcomment = this.tempSubcomment.trim()
      if (!this.tempSubcomment) {
        this.subcommentError = 'Subcomment should not be empty'
        return
      }

      if (this.sending) { return }
      this.sending = true
      this.subcommentError = undefined

      const { station, post } = this.$route.params

      try {
        const res = await this.$axios.post(`/api/comment/c/${this.id}`, {
          post,
          text: this.tempSubcomment,
          station
        })
        const { subcomment } = res.data
        this.subcomments.push(subcomment)

        this.tempSubcomment = ''
        this.writeSubcomment = false
        this.sending = false
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

.comment-text {
  word-break: break-all;
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

.red {
  border-color: var(--red);
  color: var(--red);
}
</style>
