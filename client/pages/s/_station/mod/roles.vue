<template>
  <div class="container mt-4">
    <mod-header title="Captain Roles" active-tab="roles" />
    <div class="row">
      <div class="col col-md-6">
        <h2>Captains</h2>
        <div>
          <div v-for="captain in captains" :key="`capt-${captain.username}`">
            <div class="capt-box">
              <nuxt-link :to="`/u/${captain.username}`" class="link">
                u/{{ captain.username }}
              </nuxt-link>
              <div v-if="captains.length > 1">
                <div class="remove">
                  <button @click="removeCaptain(captain.username)">
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="captError" class="error-box">
            {{ captError }}
          </div>
          <b-modal
            id="remove-captain-modal"
            centered
            title="Confirm Removal"
            ok-title="Remove"
            ok-variant="outline-danger"
            @ok="confirmSelfRemoval"
          >
            You cannot reverse this action unless another captain grants you captain status.
          </b-modal>
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
            @keyup="searchUser()"
          >
          <div v-for="user in users" :key="`crew-${user.username}`">
            <div class="user-box">
              <nuxt-link :to="`/u/${user.username}`" class="link">
                u/{{ user.username }}
              </nuxt-link>
              <div class="add">
                <button @click="addCaptain(user.username)">
                  +
                </button>
              </div>
            </div>
          </div>
          <div v-if="userError" class="error-box">
            {{ userError }}
          </div>
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
      username: '',
      users: [],
      captError: null,
      userError: null
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
      this.userError = null

      if (!this.username || this.username.length === 0) {
        this.$set(this, 'users', [])
        return
      }

      const { station: name } = this.$route.params
      try {
        const { data } = await this.$axios.get(`/api/station/members/${name}`, {
          params: {
            search: this.username
          }
        })
        if (data.users && data.users.length > 0) {
          this.$set(this, 'users', data.users)
        } else {
          this.$set(this, 'users', [])
          this.userError = 'No users found'
        }
      } catch (err) {
        this.$set(this, 'users', [])
        this.userError = 'Something went wrong while fetching users'
      }
    },

    async addCaptain (username) {
      const { station: name } = this.$route.params

      try {
        await this.$axios.post(`/api/station/roles/${name}`, {
          type: 'grant',
          username
        })
        await this.searchUser()
        await this.loadPage()
      } catch (err) {
        const { status } = err.response
        if (status === 403) {
        } else {
          this.captError = 'Something went wrong while adding captain'
        }
      }
    },

    async confirmSelfRemoval (bvModalEvt) {
      const { station: name } = this.$route.params

      bvModalEvt.preventDefault()
      try {
        this.$bvModal.hide('remove-captain-modal')
        await this.doRemove(this.$auth.user.username)
        this.$bvModal.msgBoxOk('You are no longer captain of this station.', {
          centered: true,
          okTitle: `Return to /s/${name}`,
          noCloseOnEsc: true,
          noCloseOnBackdrop: true,
          hideHeaderClose: true
        }).then(() => {
          this.$router.push(`/s/${name}`)
        })
      } catch ({ response }) {
      }
    },

    async removeCaptain (username) {
      if (username === this.$auth.user.username) {
        this.$bvModal.show('remove-captain-modal')
      } else {
        await this.doRemove(username)
      }
    },

    async doRemove (username) {
      const { station: name } = this.$route.params

      try {
        await this.$axios.post(`/api/station/roles/${name}`, {
          type: 'revoke',
          username
        })
        await this.searchUser()
        await this.loadPage()
      } catch (err) {
        const { status } = err.response
        if (status === 403) {
        } else {
          this.captError = 'Something went wrong while adding captain'
        }
      }
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

.capt-box::after {
  clear: both;
  content: '\00A0';
}

.capt-box .link {
  float: left;
  margin-right: auto;
  margin-left: 0;
}

.capt-box .remove {
  float: right;
}

.capt-box .remove button {
  margin-left: auto;
  margin-right: 0;
  border: none;
  color: red;
  padding: 0.125em 1em;
}

.user-box {
  padding: 0.5em 1em;
  border: 1px solid rgb(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 0.5em;
  position: relative;
}

.user-box .link {
  float: left;
  margin-right: auto;
  margin-left: 0;
}

.user-box .add {
  float: right;
}

.user-box .add button {
  margin-left: auto;
  margin-right: 0;
  border: none;
  color: green;
  padding: 0.125em 1em;
}

.user-box::after {
  clear: both;
  content: '\00A0';
}

.error-box {
  padding: 0.5em 1em;
  border: 1px solid red;
  margin-top: 1em;
  border-radius: 4px;
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
