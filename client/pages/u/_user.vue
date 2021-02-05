<template>
  <div class="container mt-4">
    <div v-if="is404" class="mt-3">
      <h1>User does not exist</h1>
    </div>
    <div v-else-if="hasUser">
      <h2 class="mb-2">
        Posts by User
      </h2>
      <div class="row">
        <div id="user-details" class="col-md-3 order-md-2">
          <div id="user-desc">
            <div class="box py-lg-4">
              <div id="image-container">
                <img id="image" src="https://picsum.photos/80/80" width="80" height="80">
              </div>
              <div class="mt-2 mx-auto text-center">
                <h3>u/{{ user.username }}</h3>
                <small>{{ user.fame }} fame</small>
              </div>
              <div class="mt-2 text-center">
                <button id="verify-btn" @click="verify">
                  Verify Account
                </button>
              </div>
            </div>
          </div>
          <div id="user-info" class="mt-2">
            <h3>User Information</h3>
            <div class="box p-lg-4">
              <div v-if="user.fname || user.lname || user.gender || user.birthday || user.bio">
                <div v-if="user.fname || user.lname" id="user-name">
                  {{ user.fname }} {{ user.lname }}
                  <small>(name)</small>
                </div>
                <div v-if="user.gender" id="user-gender">
                  {{ formatGender(user.gender) }}
                  <small>(gender)</small>
                </div>
                <div v-if="user.birthday" id="user-birthday">
                  {{ formatDate(user.birthday) }}
                  <small>(birthday)</small>
                </div>
                <div v-if="user.bio" id="user-bio" class="mt-3">
                  <h4>Bio</h4>
                  {{ user.bio }}
                </div>
              </div>
              <div v-else>
                <small>No user information found.</small>
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
                End of the Page
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
            This user hasn't posted anything.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import postLazyload from '../../components/post-lazyload.vue'

export default {
  components: { postLazyload },
  data () {
    return {
      is404: false,
      hasUser: false,
      user: {},
      posts: [],
      loading: true,
      end: false
    }
  },
  beforeMount () {
    this.loadUserPosts()
  },
  middlewares: ['auth'],
  methods: {
    async loadUserPosts () {
      const { user: username } = this.$route.params

      let res
      try {
        // Get the current user
        res = await this.$axios.get(`/api/user/profile/${username}`)
        const { user } = res.data
        this.$set(this, 'user', user)

        // Get all the current post by the user
        res = await this.$axios.get(`/api/post/user/${username}`)
        const { posts } = res.data
        this.$set(this, 'hasUser', true)
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

    brief (text) {
      return text.length > 100
        ? `${text.substr(0, 100)}...`
        : text
    },

    infiniteScroll ($state) {
      setTimeout(async () => {
        const { user: username } = this.$route.params

        const params = {
          offset: this.posts.length
        }

        const res = await this.$axios.get(`/api/post/user/${username}`, { params })
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
    },

    formatDate (date) {
      return moment(date).format('MM/DD/YYYY')
    },

    formatGender (gender) {
      let formatGender
      switch (gender) {
        case 'm': formatGender = 'Male'; break
        case 'f': formatGender = 'Female'; break
        case 'o': formatGender = 'Other'; break
        case 'p': formatGender = 'Prefer not to say'; break
        default: formatGender = gender
      }

      return formatGender
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

#station-dropdown {
  padding: 0px 20px;
  position: absolute;
  top: 0;
  right: 0;
}

small {
  color: rgba(255, 255, 255, 0.4)
}

</style>
