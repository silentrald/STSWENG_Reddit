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
          <div v-if="posts.length > 0" id="posts" class="col-md-9 order-md-1">
            <post
              v-for="post in posts"
              :key="post.id"
              :score="post.score"
              :author="post.author"
              :date="post.timestamp_created"
              :title="post.title"
            >
              {{ post.scope }}
              {{ post.text }}
            </post>
            <infinite-loading
              spinner="waveDots"
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
          <div v-else id="posts" class="col-md-9 order-md-1">
            No posts in this station yet.
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
      is404: false,
      hasStation: false,
      name: '',
      description: '',
      rules: '',
      captains: [],
      posts: []
    }
  },

  beforeMount () {
    this.loadStation()
  },

  methods: {
    // Start to load station
    async loadStation () {
      const { name } = this.$route.params
      let res
      try {
        // Get all captains
        res = await this.$axios.get(`/api/station/captains/${name}`)
        const { captains } = res.data
        this.$set(this, 'captains', captains)

        // Get the current station
        res = await this.$axios.get(`/api/station/id/${name}`)
        const { station } = res.data
        this.$set(this, 'hasStation', true)
        this.$set(this, 'name', station.name)
        this.$set(this, 'description', station.description)
        this.$set(this, 'rules', station.rules)

        // Get all the current post in the stations
        res = await this.$axios.get(`/api/post/station/${name}`)
        const { posts } = res.data

        this.$set(this, 'posts', posts)
        await this.getVotes()
      } catch (err) {
        const { status } = err.response

        if (status === 404) {
          this.$set(this, 'is404', true)
          // this.errors = customErrors(data.errors, customErrorMsg)
        }
      }
    },

    async getVotes () {
      const posts = this.posts
      for (const index in posts) {
        const { data } = await this.$axios.get(`/api/post-vote/score/${posts[index].post_id}`)
        this.$set(this.posts[index], 'score', data.score)
      }
    },

    infiniteScroll ($state) {
      setTimeout(async () => {
        let res = await this.$axios.get(`/api/post/station/${this.name}`, {
          params: {
            offset: this.posts.length
          }
        })
        const { posts } = res.data
        if (posts.length > 0) {
          for (const index in posts) {
            res = await this.$axios.get(`/api/post-vote/score/${posts[index].post_id}`)
            this.posts.push(posts[index])
          }
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 500)
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
