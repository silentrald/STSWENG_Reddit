<template>
  <div>
    <div class="post-container">
      <post
        v-if="post"
        :id="post.post_id"
        :score="post.score"
        :station="post.station_name"
        :author="post.author"
        :date="post.timestamp_created"
        :title="post.title"
      >
        {{ post.text }}
      </post>
      <post-single-lazyload v-else />
    </div>
    <div class="comment-container">
      <div v-if="loading">
        <h5 class="margin-bottom">
          COMMENTS
        </h5>
        <comment-lazyload :subcomments="3" />
        <comment-lazyload :subcomments="2" />
      </div>
      <div v-else>
        <h5 class="margin-bottom">
          COMMENTS ({{ post.comment_count }})
        </h5>
        <div class="margin-bottom">
          <div v-if="$auth.user">
            <div v-if="joined">
              <div class="form-group">
                <textarea
                  id="comment-text"
                  v-model="comment_text"
                  class="form-control comment-box"
                  placeholder="Write your comment here."
                  rows="5"
                />
              </div>
              <button
                id="post"
                :title="!commentIsNotEmpty ? 'Comment should not be blank' : ''"
                :disabled="!commentIsNotEmpty"
                @click="postComment()"
              >
                Post
              </button>
            </div>
            <div v-else>
              <p>You must be part of the station to comment.</p>
            </div>
          </div>
          <div v-else>
            <p>You must be logged in to comment.</p>
          </div>
        </div>
        <comment
          v-for="comment in comments"
          :id="comment.comment_id"
          :key="comment.id"
          :text="comment.text"
          :score="comment.score"
          :date="comment.timestamp_created"
          :author="comment.author"
          :subcomments="comment.subcomments || []"
          :deleted="comment.deleted"
        />
        <infinite-loading
          spinner="waveDots"
          @infinite="infiniteScroll"
        >
          <div slot="no-more">
            <!-- TODO: Add the rocket logo -->
            End of the Post
          </div>
          <div slot="no-results">
            <!-- TODO: Add the rocket logo -->
            End of the Post
          </div>
          <div slot="error" slot-scope="{ trigger }">
            Error message, click <a href="javascript:;" @click="trigger">here</a> to retry
          </div>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
const DEPTH = 3

// TODO: See More Comments
export default {
  data () {
    return {
      post: undefined,
      comments: [],
      comment_text: '',
      loading: true,
      submitting: false,
      joined: false
    }
  },

  computed: {
    commentIsNotEmpty () {
      const comment = this.comment_text
      return comment && typeof comment === 'string' && comment.trim().length > 0
    }
  },

  beforeMount () {
    this.loadPage()
  },

  methods: {
    async loadPage () {
      let res
      // Load post
      const { station: stationName, post: postID } = this.$route.params
      res = await this.$axios.get(`/api/post/${postID}`)
      const { post } = res.data

      this.$set(this, 'post', post)

      res = await this.$axios.get(`/api/station/id/${stationName}`)
      const { joined } = res.data

      this.$set(this, 'joined', joined)

      // Load subposts comments
      res = await this.$axios.get(`/api/comment/post/${postID}`)
      const { subposts } = res.data

      for (let i = 0; i < subposts.length; i++) {
        const comment = subposts[i]

        this.comments.push(comment)

        try {
          await this.loadSubcomments(comment, 1)
        } catch (_err) {}
      }

      this.loading = false
    },

    async loadSubcomments (currentComment, depth) {
      const res = await this.$axios.get(`/api/comment/c/${currentComment.comment_id}`)
      const { subcomments } = res.data
      currentComment.subcomments = subcomments

      if (depth < DEPTH && subcomments.length > 0) {
        for (let i = 0; i < subcomments.length; i++) {
          const comment = subcomments[i]

          try {
            await this.loadSubcomments(comment, depth + 1)
          } catch (_err) {}
        }
      }
    },

    async postComment () {
      if (this.submitting) { return }
      this.submitting = true

      try {
        const res = await this.$axios.post(`/api/comment/post/${this.$route.params.post}`, {
          station: this.$route.params.station,
          text: this.comment_text
        })

        const { comment } = res.data
        const next = []
        for (let i = 0; i < this.comments.length; i++) {
          next.push(this.comments[i])
        }
        next.push(comment)
        this.$set(this, 'comments', next)
        this.$set(this, 'comment_text', '')
      } catch (err) {
        this.$bvModal.msgBoxOk('Your comment could not be uploaded.', {
          centered: true,
          okTitle: 'Failed to post comment',
          noCloseOnEsc: true,
          noCloseOnBackdrop: true,
          hideHeaderClose: true
        })
      }

      this.submitting = false
    },

    infiniteScroll ($state) {
      setTimeout(async () => {
        const { post } = this.$route.params

        const params = {
          offset: this.comments.length
        }

        const res = await this.$axios.get(`/api/comment/post/${post}`, { params })
        const { subposts } = res.data
        if (subposts.length > 0) {
          for (const index in subposts) {
            const comment = subposts[index]
            this.comments.push(comment)

            try {
              await this.loadSubcomments(comment, 1)
            } catch (_err) {}
          }
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 500)
    }
  }
}
</script>

<style scoped>
.post-container, .comment-container {
  width: 60%;
  min-width: 500px;
  max-width: 1000px;
}

.post-container {
  margin: 24px auto 0 auto;
}

.comment-container {
  margin: 24px auto 200px auto;
}

.margin-bottom {
  margin-bottom: 16px;
}

.comment-box {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: #cccccc;
}

#post[disabled] {
  color: #aaaaaa;
  border-color: #aaaaaa;
  opacity: 80%;
}
</style>
