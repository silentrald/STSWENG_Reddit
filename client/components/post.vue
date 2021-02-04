<template>
  <div class="post">
    <div class="post-text">
      <div class="post-info margin-bottom">
        Posted by
        <nuxt-link :to="`/u/${author}`">
          /u/{{ author }}
        </nuxt-link>
        on {{ formatDate(date) }}
      </div>
      <div class="post-title margin-bottom">
        {{ title }}
      </div>
      <div class="post-preview margin-bottom">
        <remark>
          <slot />
        </remark>
      </div>
    </div>
    <b-row class="post-options">
      <post-vote
        :id="id"
        :score="score"
        direction="row"
      />
      <!--TODO: Change change option panel to show on individual options when more actions are added-->
      <b-dropdown
        v-if="isAuthor"
        size="lg"
        variant="link"
        toggle-class="text-decoration-none"
        right
        no-caret
      >
        <template #button-content>
          &#x22ee;<span class="sr-only">Search</span>
        </template>
        <div>
          <b-dropdown-item
            id="edit-post-button"
            to="edit"
            append
          >
            Edit
          </b-dropdown-item>
        </div>
        <div>
          <b-dropdown-item
            id="delete-post-button"
            v-b-modal.delete-post-modal
          >
            Delete
          </b-dropdown-item>
          <b-modal
            id="delete-post-modal"
            centered
            title="Confirm Deletion"
            ok-title="Delete Post"
            ok-variant="outline-danger"
            @ok="deletePost"
          >
            Are you sure you want to delete this post? All votes and comments under this post will also be deleted.
          </b-modal>
        </div>
      </b-dropdown>
    </b-row>
    <div class="post-comments">
      <!-- -->
    </div>
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
    station: {
      type: String,
      default: 'sample'
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
    }
  },

  data () {
    return {
      comments: {},
      isAuthor: this.$props.author === this.$auth.user.username
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMM D, YYYY')
    },

    async deletePost (bvModalEvt) {
      bvModalEvt.preventDefault()
      try {
        await this.$axios.delete(`/api/post/${this.id}`)
        this.$bvModal.hide('delete-post-modal')
        this.$bvModal.msgBoxOk('Post has successfully been deleted.', {
          centered: true,
          okTitle: `Return to /s/${this.$props.station}`,
          noCloseOnEsc: true,
          noCloseOnBackdrop: true,
          hideHeaderClose: true
        }).then(() => {
          this.$router.push(`/s/${this.$props.station}`)
        })
      } catch ({ response }) {
        if (response.status === 403 && response.data.error === 'not_author') {
          // TODO: Make alert that the user is not author
        }
      }
    }
  }
}
</script>

<style scoped>
.margin-bottom {
  margin-bottom: 12px;
}

.post-info {
  font-size: 0.75rem;
  color: #aaaaaa;
}

.post-preview {
  word-break: break-all;
}

.post-title {
  font-size: 1.5em;
  font-weight: 500;

  word-break: break-all;
}

.post-options {
  background-color: #ffffff1a;
  display: flex;
  justify-content: flex-end;/* 10% opacity */
  border-radius: 10px;
}
</style>
