<template>
  <div>
    <div class="container">
      <form @submit.prevent>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="station.name" type="text" class="form-control" placeholder="Name of station">
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="station.description" class="form-control" placeholder="Write a brief, but concise description for your station." />
        </div>
        <div class="form-group">
          <label for="rules">Rules</label>
          <textarea id="rules" v-model="station.rules" class="form-control" placeholder="Write down the rules of your station. Markdown syntax required." />
        </div>
        <button type="submit" class="btn btn-primary">
          Create Station
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Ajv from 'ajv'
import axios from 'axios'

import ajvErrors from '@/helpers/ajvErrors'

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-keywords')(ajv, ['transform'])

const STATION_S_SCHEMA = 'us'
const STATION_V_SCHEMA = 'uv'

ajv.addSchema({
  type: 'object',
  properties: {
    name: {
      transform: ['trim']
    },
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
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 64
    },
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
  },
  required: [
    'name'
  ]
}, STATION_V_SCHEMA)

export default {
  data () {
    return {
      station: {
        name: 'station',
        description: 'Upcoming station for your favorite topics',
        rules: 'No rules'
      },
      errors: {}
    }
  },

  middleware: ['notAuth'],

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    validate () {
      ajv.validate(STATION_S_SCHEMA, this.station)
      const validate = ajv.validate(STATION_V_SCHEMA, this.station)

      if (!validate) {
        this.errors = ajvErrors(ajv)
        return
      }

      this.submit()
    },

    submit () {
      // Get values from form
      const station = this.station

      axios.post('http://localhost:5000/api/station/create', {
        ...station
      })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error('Error')
          }

          // TODO: redirect to newly created station
          this.$router.push('/')
        })
        .catch((_err) => {
          alert('Station not created')
        })
    }
  },

  head: {
    title: 'Create Station'
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
