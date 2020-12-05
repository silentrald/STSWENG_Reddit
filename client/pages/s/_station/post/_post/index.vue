<template>
  <div>
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
</template>

<script>
export default {
  data () {
    return {
      post: {}
    }
  },

  beforeMount () {
    this.loadPost()
  },

  methods: {
    async loadPost () {
      const { post: postID } = this.$route.params
      const res = await this.$axios.get(`/api/post/${postID}`)
      const { post } = res.data

      this.$set(this, 'post', post)
    }
  }
}
</script>

<style>

</style>
