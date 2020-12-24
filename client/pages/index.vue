<template>
  <div>
    <div class="container mt-4">
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
        <top-stations class="col-md-3 order-md-2" />
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
              :station="post.station_name"
              :author="post.author"
              :date="post.timestamp_created"
              :title="post.title"
            >
              {{ post.scope }}
              {{ post.text }}
            </post-preview>
            <infinite-loading
              spinner="waveDots"
              :infinite-scroll-disabled="end"
              @infinite="infiniteScroll"
            >
              <div slot="no-more">
                <!-- TODO: Add the rocket logo -->
                End
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
            No posts found :(
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postPreview from '../components/post-preview.vue'
export default {
  components: { postPreview },
  data () {
    return {
      posts: [],
      topStations: [],
      loading: true,
      end: false
    }
  },

  beforeMount () {
    this.loadPage()
  },

  methods: {
    // Loads the homepage
    async loadPage () {
      const { t: top } = this.$route.query

      let res
      try {
        // Get top stations
        res = await this.$axios.get('/api/station/top')
        this.$set(this, 'topStations', res.data.stations)

        if (top) {
          res = await this.$axios.get('/api/post', {
            params: { top }
          })
        } else {
          res = await this.$axios.get('/api/post')
        }
        const { posts } = res.data

        this.$set(this, 'posts', posts)
        this.loading = false
      } catch (_err) {}
    },

    infiniteScroll ($state) {
      setTimeout(async () => {
        const { t: top } = this.$route.query

        const params = {
          offset: this.posts.length
        }

        if (top) {
          params.top = top
        }

        const res = await this.$axios.get('/api/post', { params })
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
        const res = await this.$axios.get('/api/post')
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
        const res = await this.$axios.get('/api/post', {
          params: { top }
        })
        const { posts } = res.data
        this.$set(this, 'posts', posts)
      } catch (err) {}

      this.loading = false
    }
  }
}
</script>

<style>

</style>
