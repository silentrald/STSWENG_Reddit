<template>
  <div>
    <div class="container mt-4">
      <div v-if="is404" class="mt-3">
        <h1>Station does not exist</h1>
      </div>
      <div v-else-if="hasStation">
        <b-nav class="mb-2">
          <b-nav-item active>
            NEW
          </b-nav-item>
          <b-nav-item-dropdown
            id="top-nav-dropdown"
            text="TOP"
            toggle-class="nav-link-custom"
          >
            <b-dropdown-item>Past hour</b-dropdown-item>
            <b-dropdown-item>Past 24 hours</b-dropdown-item>
            <b-dropdown-item>Past week</b-dropdown-item>
            <b-dropdown-item>Past month</b-dropdown-item>
            <b-dropdown-item>Past year</b-dropdown-item>
            <b-dropdown-item>All time</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
        <div class="row">
          <div id="station-info" class="col-md-3 order-md-2">
            <div id="station-name-desc">
              <div class="box">
                <div id="image-container">
                  <img id="image" src="https://picsum.photos/80/80" width="80" height="80">
                </div>
                <div id="join-leave" class="mt-2 mb-1 w-50 mx-auto">
                  <button v-if="joined" id="leave-button" @click="leave()">
                    LEAVE
                  </button>
                  <button v-else id="join-button" @click="join()">
                    JOIN
                  </button>
                </div>
                <h3>s/{{ name }}</h3>
                <p>{{ description }}</p>
              </div>
            </div>
            <div id="station-rules" class="mt-2">
              <h4>Rules</h4>
              <div class="box">
                {{ rules }}
              </div>
            </div>
            <div id="station-mods" class="mt-2">
              <h4>Moderators</h4>
              <div class="box">
                <div v-for="cap in captains" :key="cap.username">
                  c/{{ cap.username }}
                </div>
              </div>
            </div>
          </div>
          <div id="posts" class="col-md-9 order-md-1">
            <post />
            <post />
            <post />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import post from '../../../components/post.vue'
export default {
  components: { post },
  data () {
    return {
      is404: false,
      hasStation: false,
      joined: false,
      name: '',
      description: '',
      rules: '',
      captains: []
    }
  },

  beforeMount () {
    this.loadStation()
  },

  methods: {
    loadStation () {
      const name = this.$route.params.name
      this.$axios.get(`/api/station/id/${name}`)
        .then((res) => {
          const { station, joined } = res.data
          this.$set(this, 'hasStation', true)
          this.$set(this, 'name', station.name)
          this.$set(this, 'description', station.description)
          this.$set(this, 'rules', station.rules)
          if (joined) { this.$set(this, 'joined', joined) }
        })
        .catch((err) => {
          const { status } = err.response

          if (status === 404) {
            this.$set(this, 'is404', true)
            // this.errors = customErrors(data.errors, customErrorMsg)
          }
        })

      this.$axios.get(`/api/station/captains/${this.name}`)
        .then((res) => {
          const { captains } = res.data
          this.$set(this, 'captains', captains)
        })
        .catch((err) => {
          const { status } = err.response

          if (status === 404) {
            // this.errors = customErrors(data.errors, customErrorMsg)
          }
        })
    },

    join () {
      this.$axios.post(`/api/station/join/${this.name}`)
        .then(() => {
          // When the user successfully joins, it sends 200 (or 204?) to indicate success
          this.$set(this, 'joined', true)
        })
        .catch((err) => {
          const { status } = err.response

          if (status === 404) {
            // this.errors = customErrors(data.errors, customErrorMsg)
          }
        })
    },

    leave () {
      this.$axios.post(`/api/station/leave/${this.name}`)
        .then(() => {
          // When the user successfully leaves, it sends 200 (or 204?) to indicate success
          this.$set(this, 'joined', false)
        })
        .catch((err) => {
          const { status } = err.response

          if (status === 404) {
            // this.errors = customErrors(data.errors, customErrorMsg)
          }
        })
    }
  }
}
</script>

<style>
.nav-link {
  color: #aaaaaa;
}

.nav-link.active {
  color: #ff3232;
}

.box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 10px 15px;
}

#station-name-desc img {
  border-radius: 50%;
}

#image-container {
  margin: 0 auto;
  width: 80px;
}

#station-name-desc h3, p {
  text-align: center;
}

</style>
