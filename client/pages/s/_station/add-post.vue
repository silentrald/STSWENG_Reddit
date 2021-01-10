<template>
  <div>
    <div class="form-container">
      <form @submit.prevent>
        <h1>Add Post</h1>
        <br>
        <div class="form-group">
          <div v-if="errors.title" class="error">
            {{ errors.title }}
          </div>
          <input
            id="title"
            v-model="post.title"
            type="text"
            class="form-control"
            placeholder="Post Title"
            @keydown="removeError('title')"
          >
        </div>
        <div class="form-group">
          <div v-if="errors.text" class="error">
            {{ errors.text }}
          </div>
          <textarea
            id="text"
            v-model="post.text"
            class="form-control"
            placeholder="Post Body"
            @keydown="removeError('text')"
          />
        </div>
        <button id="submit" @click="submit()">
          SUBMIT
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Ajv from 'ajv'

// TODO: fix ajv
import ajvErrors from '@/helpers/ajvErrors'
import customErrors from '@/helpers/customErrors'

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-keywords')(ajv, ['transform'])

const POST_S_SCHEMA = 'ps'
const POST_V_SCHEMA = 'pv'

ajv.addSchema({
  type: 'object',
  properties: {
    title: {
      transform: ['trim']
    },
    text: {
      transform: ['trim']
    },
    station_name: {
      transform: ['trim']
    },
    author: {
      transform: ['trim']
    }
  }
}, POST_S_SCHEMA)

ajv.addSchema({
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 64
    },
    text: {
      type: 'string',
      minLength: 1,
      maxLength: 1000
    }
  },
  required: [
    'title',
    'text'
  ]
}, POST_V_SCHEMA)

const customErrorMsg = {
  title: {
    maxLength: 'Post title is too long (max 64)',
    minLength: 'Post title is required'
  },
  text: {
    maxLength: 'Post text is too long (max 1000)',
    minLength: 'Post text is required'
  }
}

export default {
  data () {
    return {
      post: {
        title: '',
        text: ''
      },
      errors: { }
    }
  },

  middleware: ['auth', 'joined'],

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    // TODO: update this validate
    validate () {
      ajv.validate(POST_S_SCHEMA, this.user)
      const validate = ajv.validate(POST_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = customErrors(ajvErrors(ajv), customErrorMsg)
        return false
      }
      return true
    },

    submit () {
      // Get values from form
      // if (this.validate() {
      const { station: name } = this.$route.params
      const post = {
        ...this.post
      } // Deep clone

      this.$axios.post(`/api/post/station/${name}`, {
        ...post
      })
        .then((res) => {
          if (res.status !== 201) {
            return
          }

          this.$router.push(`/s/${name}`)
        })
        .catch((err) => {
          const { status, data } = err.response

          if (status === 401) {
            this.errors = customErrors(data.errors, customErrorMsg)
          }
        })
      // }
    }
  },

  head: {
    title: 'Add Post'
  }
}
</script>

<style scoped>
.form-container {
  margin: 10vh auto 0 auto;
  width: 450px;
}

#image {
  margin: 16px 0;
  border-radius: 50%;
}

input, input:focus, textarea, textarea:focus {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus, textarea:focus {
  box-shadow: none;
}

#submit {
  float: right;
}
</style>
