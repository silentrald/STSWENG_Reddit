<template>
  <div>
    <div class="post-container">
      <post
        :id="post.post_id"
        :score="post.score"
        :author="post.author"
        :date="post.timestamp_created"
        :title="post.title"
      >
        {{ post.text }}
      </post>
    </div>
    <div class="comment-container">
      <h5 class="margin-bottom">
        COMMENTS ({{ post.comment_count }})
      </h5>
      <comment
        v-for="comment in comments"
        :id="comment.comment_id"
        :key="comment.id"
        :text="comment.text"
        :score="comment.score"
        :author="comment.author"
        :subcomments="comment.subcomments"
      />
    </div>
  </div>
</template>

<script>
const DEPTH = 3

export default {
  data () {
    return {
      post: {},
      comments: []
    }
  },

  beforeMount () {
    this.loadPage()
  },

  methods: {
    async loadPage () {
      let res
      // Load post
      const { post: postID } = this.$route.params
      res = await this.$axios.get(`/api/post/${postID}`)
      const { post } = res.data

      this.$set(this, 'post', post)

      // Load subposts comments
      res = await this.$axios.get(`/api/subpost/post/${postID}`)
      const { subposts } = res.data

      for (let i = 0; i < subposts.length; i++) {
        const comment = subposts[i]

        this.comments.push(comment)

        try {
          await this.loadSubcomments(comment, 1)
        } catch (_err) {}
      }
    },

    async loadSubcomments (currentComment, depth) {
      const res = await this.$axios.get(`/api/subcomment/comment/${currentComment.comment_id}`)
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
  margin: 24px auto 250px auto;
}

.margin-bottom {
  margin-bottom: 16px;
}
</style>
