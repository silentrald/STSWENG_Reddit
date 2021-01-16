<template>
  <div id="verification">
    <div v-if="success">
      Verication Success
    </div>
    <div v-else>
      {{ msg }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      success: false,
      msg: 'Verifying...'
    }
  },

  beforeMount () {
    this.verifyLink()
  },

  methods: {
    async verifyLink () {
      const {
        user: username,
        key: token
      } = this.$route.query
      if (!token) {
        return
      }

      try {
        await this.$axios.post('/api/verification/verify', {
          username,
          token
        })
        this.$set(this, 'success', true)
      } catch (err) {
        this.$set(this, 'msg', 'Verification Failed')
        const { data } = err.response
        switch (data.error) {
          case 'ILNK':
            // Invalid Link
            break
          case 'EXPD':
            // Expired link
            break
          case 'ITKN':
            // Invalid Token
            break
          default:
            // error 500
            break
        }
      }
    }
  }
}
</script>

<style>

</style>
