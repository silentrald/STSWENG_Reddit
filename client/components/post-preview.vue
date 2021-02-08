<template>
  <div class="post">
    <post-vote
      :id="id"
      :score="score"
      direction="col"
    />
    <div class="post-text">
      <div class="post-info">
        <nuxt-link class="station-link" :to="`/s/${station}`">
          s/{{ station }}
        </nuxt-link>
        Posted by /u/{{ author }} on {{ formatDate(date) }}
      </div>
      <div class="post-title" @click="toPost()">
        {{ title }}
      </div>
      <div class="post-preview" @click="toPost()">
        <slot />
      </div>
    </div>
    <!-- <div>
      TODO: change to icon
      Comments: {{ commentCount }}
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    score: {
      type: Number,
      default: 0
    },
    author: {
      type: String,
      default: 'anonymous'
    },
    date: {
      type: String,
      default: 'no date'
    },
    title: {
      type: String,
      default: ''
    },
    station: {
      type: String,
      default: ''
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    },

    toPost () {
      this.$router.push(`/s/${this.station}/post/${this.id}`)
    }
  }
}
</script>

<style scoped>
.post {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px 16px;
  width: 100%;

  word-wrap: break-word;

  display: flex;
}

.post-info {
  font-size: 0.75rem;
  color: #aaaaaa;
}

.station-link {
  font-size: 18px;
  color: white;
  text-decoration: none;
}

.post-preview {
  /* word-wrap: break-word; */
  word-break: break-all;
}

.post-title {
  font-size: 1.5em;
  font-weight: 500;

  /* word-wrap: break-word; */
  word-break: break-all;
}
</style>
