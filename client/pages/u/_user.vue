<template>
  <div id="user">
    <button id="verify-btn" @click="verify">
      Verify Account
    </button>
  </div>
</template>

<script>
export default {
  middlewares: ['auth'],
  methods: {
    async verify () {
      try {
        await this.$axios.post('/api/verification')
      } catch (err) {
        const { data } = err.response
        switch (data) {
          case 'VRFD':
            // account already verified
            break
        }
      }
    }
  }
}
</script>

<style>

</style>
