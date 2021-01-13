<template>
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
              <div>
                <b-dropdown
                  id="station-dropdown"
                  size="lg"
                  variant="link"
                  toggle-class="text-decoration-none"
                  right
                  no-caret
                >
                  <template #button-content>
                    &#x22ee;<span class="sr-only">Search</span>
                  </template>
                  <b-dropdown-item>
                    Report
                  </b-dropdown-item>
                  <div v-if="isCaptain">
                    <b-dropdown-divider />
                    <b-dropdown-item to="mod" append>
                      Moderator Tools
                    </b-dropdown-item>
                    <b-dropdown-item to="mod/info" append>
                      Edit Info
                    </b-dropdown-item>
                  </div>
                </b-dropdown>
              </div>
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
          <!-- Add check if user if part of station instead of logged in -->
          <div v-if="joined" class="mt-2">
            <nuxt-link id="add-post" class="nav-link" to="add-post" append>
              <button class="btn-block">
                Add Post
              </button>
            </nuxt-link>
          </div>
        </div>
        <div v-if="loading" class="col-md-9 order-md-1">
          <post-lazyload />
          <post-lazyload />
          <post-lazyload />
        </div>
        <div v-else class="col-md-9 order-md-1">
          <div v-if="posts.length > 0" id="posts">
            <post-preview
              v-for="post in posts"
              :id="post.post_id"
              :key="post.post_id"
              :score="post.score"
              :author="post.author"
              :date="post.timestamp_created"
              :title="post.title"
              :station="post.station_name"
              :comment-count="post.comment_count"
              @click="toPost(post.id)"
            >
              {{ brief(post.text) }}
            </post-preview>
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
      joined: false,
      isCaptain: false
    }
  },

  beforeMount () {
    this.loadStation()
  },

  methods: {
    // Start to load station
    async loadStation () {
      const { station: name } = this.$route.params
      const { t: top } = this.$route.query

      let res
      try {
        // Get all captains
        res = await this.$axios.get(`/api/station/captains/${name}`)
        const { captains } = res.data
        this.$set(this, 'captains', captains)

        // Get the current station
        res = await this.$axios.get(`/api/station/id/${name}`)
        const { station, joined, isCaptain } = res.data
        this.$set(this, 'hasStation', true)
        this.$set(this, 'name', station.name)
        this.$set(this, 'description', station.description)
        this.$set(this, 'rules', station.rules)
        if (joined) { this.$set(this, 'joined', joined) }
        if (isCaptain) { this.$set(this, 'isCaptain', isCaptain) }

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
        const { station } = this.$route.params
        const { t: top } = this.$route.query

        const params = {
          offset: this.posts.length
        }

        if (top) {
          params.top = top
        }

        const res = await this.$axios.get(`/api/post/station/${station}`, { params })
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
        const res = await this.$axios.get(`/api/post/station/${this.$route.params.station}`)
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
        const res = await this.$axios.get(`/api/post/station/${this.$route.params.station}`, {
          params: { top }
        })
        const { posts } = res.data
        this.$set(this, 'posts', posts)
      } catch (err) {}

      this.loading = false
    },

    brief (text) {
      return text.length > 100
        ? `${text.substr(0, 100)}...`
        : text
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

#station-dropdown {
  padding: 0px 20px;
  position: absolute;
  top: 0;
  right: 0;
}

</style>
