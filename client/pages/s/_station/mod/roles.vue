<template>
  <div class="container mt-4">
    <mod-header title="Captain Roles" active-tab="roles" />
    <div class="row">
      <div class="col col-md-6">
        <h2>Captains</h2>
        <div>
          <div v-for="captain in captains" :key="captain.username">
            <div class="capt-box">
              <nuxt-link :to="`/u/${captain.username}`" class="link">
                u/{{ captain.username }}
              </nuxt-link>
              <!--<div v-if="captain.username !== $auth.user.username">-->
              <button class="remove" @click="removeCaptain(captain.username)">
                &times;
              </button>
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="col col-md-6">
        <h2>Search users</h2>
        <div>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Find users..."
            @change="searchUser()"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      captains: [],
      username: ''
    }
  },

  middleware: ['auth'],

  beforeMount () {
    this.loadPage()
  },

  methods: {
    async loadPage () {
      const { station: name } = this.$route.params

      try {
        const res = await this.$axios.get(`/api/station/captains/${name}`)
        const { captains } = res.data
        this.captains = captains
      } catch (_err) {}
    },

    async searchUser () {
      try {
        const { data } = await this.$axios.get('/api/user', {
          params: {
            search: this.searchQuery
          }
        })
        this.$set(this, 'users', data.users)
      } catch (err) {
        const { status } = err.response
        if (status === 404) {
          if (this.users.length === 0) {
            this.$set(this, 'users', undefined)
          } else {}
        }
      }
    },

    removeCaptain (capt) {

    }
  },

  head: {
    title: 'Captain Roles'
  }
}
</script>

<style scoped>
.capt-box {
  padding: 0.5em 1em;
  border: 1px solid rgb(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 0.5em;
  position: relative;
}

.capt-box .link {
  margin-right: auto;
  margin-left: 0;
}

.capt-box .remove {
  margin-left: auto;
  margin-right: 0;
  border: none;
  color: red;
  padding: 0.125em 1em;
}

input, input:focus, textarea, textarea:focus {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus, textarea:focus {
  box-shadow: none;
}

</style>
