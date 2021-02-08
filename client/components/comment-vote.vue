<template>
  <div :class="`vote-${direction}`">
    <div class="upvote" @click="commentVote(true)">
      <img
        src="/images/thumb-up.png"
        width="24"
        height="24"
        :class="mergeClasses(upvoteClass, disabledClass)"
      >
    </div>
    <div class="score">
      {{ localScore }}
    </div>
    <div class="downvote" @click="commentVote(false)">
      <img
        src="/images/thumb-down.png"
        width="24"
        height="24"
        :class="mergeClasses(downvoteClass, disabledClass)"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'sample'
    },
    score: {
      type: Number,
      default: 0
    },
    direction: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      localScore: 0,
      vote: 0,
      voting: false
    }
  },

  computed: {
    upvoteClass () {
      return {
        upvoted: this.vote === 1
      }
    },

    downvoteClass () {
      return {
        downvoted: this.vote === -1
      }
    },

    disabledClass () {
      return {
        disabled: this.disabled
      }
    }
  },

  beforeMount () {
    if (!this.lazy) {
      this.localScore = this.score

      if (this.$auth.user) {
        this.getVote()
      }
    }
  },

  methods: {
    mergeClasses (...classes) {
      return classes.reduce((prev, next) => Object.assign(prev, next), {})
    },

    async getVote () {
      try {
        const { data } = await this.$axios.get(`/api/comment-vote/${this.id}`)
        const vote = data.upvote === true ? 1
          : (data.upvote === false ? -1 : 0)

        this.$set(this, 'vote', vote)
      } catch (_err) {}
    },

    async commentVote (upvote) {
      // ensure comment is not deleted before casting or reverting a vote
      if (this.disabled || this.voting) {
        return
      }
      this.voting = true

      try {
        const { data } = await this.$axios.post(`/api/comment-vote/${this.id}`, { upvote })
        this.$set(this, 'localScore', this.localScore + data.inc)
        this.$set(this, 'vote', data.vote)
      } catch ({ response }) {
        if (response.status === 403 && response.data.error === 'not_crew') {
          // TODO: Make alert that the user is not login
        }
      }
      this.voting = false
    }
  }
}
</script>

<style scoped>
.vote-col {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-right: 16px;
  min-width: 64px;
}

.vote-row {
  display: flex;

  justify-content: flex-end;
  background-color: #ffffff1a; /* 10% opacity */
  padding: 0.5rem;
  border-radius: 10px;
}

.upvote, .downvote {
  cursor: pointer;
  width: max-content;
  margin: 0 8px;
}

.score {
  text-align: center;
}

/* TODO: Change design here */
.upvoted {
  filter: sepia(1) hue-rotate(45deg) saturate(20);
}

/* TODO: Chage design here */
.downvoted {
  filter: sepia(1) saturate(20) hue-rotate(-90deg) saturate(20) hue-rotate(45deg);
}

img.disabled {
  opacity: 50%;
}

</style>
