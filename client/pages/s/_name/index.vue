<template>
  <div>
    <div class="container mt-4">
      <div v-if="is404" class="mt-3">
        <h1>Station does not exist</h1>
      </div>
      <div v-else-if="hasStation">
        <b-nav class="mb-2">
          <b-nav-item active @click="getNewPosts()">
            NEW
          </b-nav-item>
          <b-nav-item-dropdown
            id="top-nav-dropdown"
            text="TOP"
            toggle-class="nav-link-custom"
          >
            <b-dropdown-item @click="getTopPosts('hour')">
              Past hour
            </b-dropdown-item>
            <b-dropdown-item @click="getTopPosts('day')">
              Past 24 hours
            </b-dropdown-item>
            <b-dropdown-item @click="getTopPosts('week')">
              Past week
            </b-dropdown-item>
            <b-dropdown-item @click="getTopPosts('month')">
              Past month
            </b-dropdown-item>
            <b-dropdown-item @click="getTopPosts('year')">
              Past year
            </b-dropdown-item>
            <b-dropdown-item @click="getTopPosts('all')">
              All time
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
        <div class="row">
          <div id="station-info" class="col-md-3 order-md-2">
            <div id="station-name-desc">
              <div class="box">
                <div id="image-container">
                  <img id="image" src="https://picsum.photos/80/80" width="80" height="80">
                </div>
                <div id="join-leave" class="mt-2 mb-1 w-50 mx-auto text-center">
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
          <div v-if="loading" class="col-md-9 order-md-1">
            <post-lazyload />
            <post-lazyload />
            <post-lazyload />
          </div>
          <div v-else class="col-md-9 order-md-1">
            <div v-if="posts.length > 0" id="posts">
              <post
                v-for="post in posts"
                :key="post.id"
                :score="post.score"
                :station="post.station_name"
                :author="post.author"
                :date="post.timestamp_created"
                :title="post.title"
              >
                {{ post.scope }}
                {{ post.text }}
              </post>
              <infinite-loading
                spinner="waveDots"
                :infinite-scroll-disabled="end"
                @infinite="infiniteScroll"
              >
                <div slot="no-more">
                  <!-- TODO: Add the rocket logo -->
                  End of the Station
                </div>
                <div slot="no-results">
                  No results message
                </div>
                <div slot="error" slot-scope="{ trigger }">
                  Error message, click <a href="javascript:;" @click="trigger">here</a> to retry
                </div>
              </infinite-loading>
            </div>
            <div v-else id="posts">
              No posts in this station yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postLazyload from '../../../components/post-lazyload.vue'
export default {
  components: { postLazyload },
  data () {
    return {
      is404: false,
      hasStation: false,
      name: '',
      description: '',
      rules: '',
      captains: [],
      posts: [],
      loading: true,
      end: false,
      joined: false
    }
  },

  beforeMount () {
    this.loadStation()
  },

  methods: {
    // Start to load station
    async loadStation () {
      const { name } = this.$route.params
      const { t: top } = this.$route.query

      let res
      try {
        // Get all captains
        res = await this.$axios.get(`/api/station/captains/${name}`)
        const { captains } = res.data
        this.$set(this, 'captains', captains)

        // Get the current station
        res = await this.$axios.get(`/api/station/id/${name}`)
        const { station, joined } = res.data
        this.$set(this, 'hasStation', true)
        this.$set(this, 'name', station.name)
        this.$set(this, 'description', station.description)
        this.$set(this, 'rules', station.rules)
        if (joined) { this.$set(this, 'joined', joined) }

        // Get all the current post in the stations
        if (top) {
          res = await this.$axios.get(`/api/post/station/${name}`, {
            params: { top }
          })
        } else {
          res = await this.$axios.get(`/api/post/station/${name}`)
        }
        const { posts } = res.data

        this.$set(this, 'posts', posts)

        this.loading = false
      } catch (err) {
        const { status } = err.response

        if (status === 404) {
          this.$set(this, 'is404', true)
          // this.errors = customErrors(data.errors, customErrorMsg)
        }
      }
    },

    infiniteScroll ($state) {
      setTimeout(async () => {
        const { name } = this.$route.params
        const { t: top } = this.$route.query

        const params = {
          offset: this.posts.length
        }

        if (top) {
          params.top = top
        }

        const res = await this.$axios.get(`/api/post/station/${name}`, { params })
        const { posts } = res.data
        if (posts.length > 0) {
          for (const index in posts) {
            this.posts.push(posts[index])
          }
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 500)
    },

    async getNewPosts () {
      if (this.top === undefined) {
        return
      }

      this.end = false

      this.$router.push({ query: { t: undefined } })
      this.top = false
      this.loading = true
      this.$set(this, 'posts', [])

      try {
        const res = await this.$axios.get(`/api/post/station/${this.$route.params.name}`)
        const { posts } = res.data
        this.$set(this, 'posts', posts)
      } catch (err) {}

      this.loading = false
    },

    async getTopPosts (top) {
      if (this.top === top) {
        return
      }

      this.end = false

      this.$router.push({ query: { t: top } })
      this.top = top
      this.loading = true
      this.$set(this, 'posts', [])

      try {
        const res = await this.$axios.get(`/api/post/station/${this.$route.params.name}`, {
          params: { top }
        })
        const { posts } = res.data
        this.$set(this, 'posts', posts)
      } catch (err) {}

      this.loading = false
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
