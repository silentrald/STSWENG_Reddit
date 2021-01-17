<template>
  <div class="container mt-4">
    <mod-header title="Edit Station Info" active-tab="info" />
    <div class="form-container">
      <form @submit.prevent>
        <div class="form-group">
          <div v-if="errors.name" class="error">
            {{ errors.description }}
          </div>
          <div class="row">
            <div class="col col-sm-6">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="station.description"
                class="form-control"
                placeholder="Write a brief, but concise description for your station."
                rows="5"
                @keydown="removeError('description')"
              />
            </div>
            <div class="col col-sm-6">
              <label>Preview</label>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="md-preview" v-html="markdownDescription" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <div v-if="errors.rules" class="error">
            {{ errors.description }}
          </div>
          <div class="row">
            <div class="col col-sm-6">
              <label for="rules">Rules</label>
              <textarea
                id="rules"
                v-model="station.rules"
                class="form-control"
                placeholder="Write down the rules of your station."
                rows="5"
                @keydown="removeError('rules')"
              />
            </div>
            <div class="col col-sm-6">
              <label>Preview</label>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="md-preview" v-html="markdownRules" />
            </div>
          </div>
        </div>
        <button id="update" @click="validate()">
          UPDATE
        </button>
        <div v-if="success" class="success mt-1">
          Station info updated successfully.
        </div>
        <div v-else-if="error" class="error mt-1">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify'
import marked from 'marked'

import Ajv from 'ajv'

import ajvErrors from '@/helpers/ajvErrors'
import customErrors from '@/helpers/customErrors'

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-keywords')(ajv, ['transform'])

const STATION_S_SCHEMA = 'us'
const STATION_V_SCHEMA = 'uv'

ajv.addSchema({
  type: 'object',
  properties: {
    description: {
      transform: ['trim']
    },
    rules: {
      transform: ['trim']
    }
  }
}, STATION_S_SCHEMA)

ajv.addSchema({
  type: 'object',
  properties: {
    description: {
      type: 'string',
      minLength: 0,
      maxLength: 250
    },
    rules: {
      type: 'string',
      minLength: 0,
      maxLength: 1000
    }
  }
}, STATION_V_SCHEMA)

const customErrorMsg = {
  name: {
    maxLength: 'Station name is too long (max 64)',
    minLength: 'Station name is too short (min 3)',
    used: 'Station name is already used',
    pattern: 'Station name contains invalid characters'
  }
}

export default {
  data () {
    return {
      station: {
        description: '',
        rules: ''
      },
      errors: {},
      error: null,
      success: false
    }
  },

  middleware: ['auth'],

  computed: {
    markdownDescription () {
      const mdhtml = marked(this.station.description || '')
      return DOMPurify.sanitize(mdhtml)
    },

    markdownRules () {
      const mdhtml = marked(this.station.rules || '')
      return DOMPurify.sanitize(mdhtml)
    }
  },

  beforeMount () {
    this.loadPage()
  },

  methods: {
    async loadPage () {
      const { station: name } = this.$route.params
      try {
        // Get the current station
        const res = await this.$axios.get(`/api/station/id/${name}`)
        const { station } = res.data
        this.$set(this.station, 'description', station.description)
        this.$set(this.station, 'rules', station.rules)
      } catch (err) {
        const { status } = err.response

        if (status === 404) {
          this.$set(this, 'is404', true)
          // this.errors = customErrors(data.errors, customErrorMsg)
        }
      }
    },

    removeError (field) {
      delete this.errors[field]
      this.success = false
    },

    validate () {
      ajv.validate(STATION_S_SCHEMA, this.station)
      const validate = ajv.validate(STATION_V_SCHEMA, this.station)

      if (!validate) {
        this.errors = customErrors(ajvErrors(ajv), customErrorMsg)
        return
      }

      this.submit()
    },

    submit () {
      // Get values from form
      const info = this.station
      const { station: name } = this.$route.params

      this.success = false
      this.$axios.post(`/api/station/info/${name}`, {
        ...info
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('Error')
          }

          this.success = true
        })
        .catch((_err) => {
          const { status, data } = _err.response

          if (status === 401) {
            this.error = 'There are errors in your input.'
            this.errors = customErrors(data.errors, customErrorMsg)
          } else {
            this.error = 'Failed to update station info.'
          }
        })
    }
  },

  head: {
    title: 'Edit Station Info'
  }
}
</script>

<style scoped>
.form-container input,
.form-container input:focus,
.form-container textarea,
.form-container textarea:focus {
  background-color: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus, textarea:focus {
  box-shadow: none;
}

.error {
  color: red;
}

.success {
  color: lime;
}

.md-preview {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background: transparent;
  color: white;
  border: 2px solid #c4c4c4;
  border-radius: 0.5rem;
}

</style>
