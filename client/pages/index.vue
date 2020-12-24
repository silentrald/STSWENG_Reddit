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
export default {

}
</script>

<style>

</style>
