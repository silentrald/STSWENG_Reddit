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
            placeholder="Post Text"
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

const USER_S_SCHEMA = 'us'
const USER_V_SCHEMA = 'uv'

ajv.addSchema({
  type: 'object',
  properties: {
    title: {
      transform: ['trim']
    }
  }
}, USER_S_SCHEMA)

ajv.addSchema({
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 8,
      maxLength: 64
    },
    text: {
      type: 'string',
      minLength: 8,
      maxLength: 256
    }
  },
  required: [
    'title',
    'text'
  ]
}, USER_V_SCHEMA)

const customErrorMsg = {
  title: {
    maxLength: 'Post title is too long (max 64)',
    minLength: 'Post title is too short (min 8)'
  },
  text: {
    maxLength: 'Post text is too long (max 256)',
    minLength: 'Post text is too short (min 8)'
  }
}

export default {
  data () {
    return {
      post: {
        title: 'title',
        text: 'text'
      },
      errors: { }
    }
  },

  middleware: [],

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    // TODO: update this validate
    validate () {
      ajv.validate(USER_S_SCHEMA, this.user)
      const validate = ajv.validate(USER_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = customErrors(ajvErrors(ajv), customErrorMsg)
        return false
      }
      return true
    },

    submit () {
      // Get values from form
      if (this.validate()) {
        const station_name = this.$route.params.name
        const post = { ...this.post, station_name } // Deep clone

        this.$axios.post(`/api/station/${station_name}`, {
          ...post
        })
          .then((res) => {
            if (res.status !== 201) {
              return
            }

            this.$router.push('/success')
          })
          .catch((err) => {
            const { status, data } = err.response

            if (status === 401) {
              this.errors = customErrors(data.errors, customErrorMsg)
            }
          })
      }
    }
  },

  head: {
    title: 'Sign Up'
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
