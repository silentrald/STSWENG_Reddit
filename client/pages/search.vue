<template>
  <div id="search">
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-9">
          <div id="stations">
            <h1>Stations</h1>
            <div v-if="stations === undefined">
              No stations found :&lt;
            </div>
            <div v-else>
              <div
                v-for="station in stations"
                :key="station.name"
                class="box"
              >
                <div class="image-container">
                  <img class="image" src="https://picsum.photos/48/48">
                </div>
                <nuxt-link :to="`/s/${station.name}`">
                  s/{{ station.name }}
                </nuxt-link>
              </div>
            </div>
          </div>

          <hr>

          <div id="users">
            <h1>Users</h1>
            <div v-if="users === undefined">
              No users found :&lt;
            </div>
            <div v-else>
              <div
                v-for="user in users"
                :key="user.username"
                class="box"
              >
                <div class="image-container">
                  <img class="image" src="https://picsum.photos/48/48">
                </div>
                <nuxt-link :to="`/u/${user.username}`">
                  u/{{ user.username }}
                </nuxt-link>
              </div>
            </div>
          </div>

          <hr>

          <div id="posts">
            <h1>Posts</h1>
            <div v-if="users === undefined">
              No posts found :&lt;
            </div>
            <div v-else>
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
            </div>
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
      searchQuery: '',
      stations: [],
      users: [],
      posts: []
    }
  },

  watch: {
    $route () {
      if (this.searchQuery !== this.$route.query.s) {
        this.$set(this, 'stations', [])
        this.$set(this, 'searchQuery', this.$route.query.s)
        this.search()
      }
    }
  },

  created () {
    this.$set(this, 'searchQuery', this.$route.query.s)
    this.search()
  },

  methods: {

    search () {
      this.searchStations()
      this.searchUser()
      this.searchPost()
    },

    async searchStations () {
      try {
        const { data } = await this.$axios.get('/api/station', {
          params: {
            search: this.searchQuery
          }
        })
        this.$set(this, 'stations', data.stations)
      } catch (err) {
        const { status } = err.response
        if (status === 404) {
          if (this.stations.length === 0) {
            this.$set(this, 'stations', undefined)
          } else {}
        }
      }
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

    async searchPost () {
      try {
        const { data } = await this.$axios.get('/api/post', {
          params: {
            search: this.searchQuery
          }
        })
        this.$set(this, 'posts', data.posts)
      } catch (err) {
        const { status } = err.response
        if (status === 404) {
          if (this.posts.length === 0) {
            this.$set(this, 'posts', undefined)
          } else {}
        }
      }
    },

    brief (text) {
      return text.length > 100
        ? `${text.substr(0, 100)}...`
        : text
    }
  }
}
</script>

<style scoped>
hr {
  background: white;
}

.box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px 16px;

  display: flex;
  align-items: center;
}

.image-container {
  margin-right: 8px;
  width: 48px;
}

.image {
  border-radius: 50%;
  width: 48px;
  height: 48px;
}
</style>
