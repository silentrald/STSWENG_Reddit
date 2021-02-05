<template>
  <div>
    <div v-if="!is404" class="form-container">
      <form @submit.prevent>
        <h1>Edit u/{{ user.username }}'s Profile</h1>
        <br>
        <b-form-group description="Name">
          <b-input-group>
            <div v-if="errors.fname" class="error">
              {{ errors.fname }}
            </div>
            <b-form-input
              id="fname"
              v-model="user.fname"
              type="text"
              class="form-control"
              placeholder="First Name"
              @keydown="removeError('fname')"
            />
            <div v-if="errors.lname" class="error">
              {{ errors.lname }}
            </div>
            <b-form-input
              id="lname"
              v-model="user.lname"
              type="text"
              class="form-control"
              placeholder="Last Name"
              @keydown="removeError('lname')"
            />
          </b-input-group>
        </b-form-group>
        <b-form-group description="Gender">
          <b-form-select v-model="user.gender" :options="genderOptions" class="form-control" />
        </b-form-group>
        <b-form-group description="Birthday">
          <div v-if="errors.birthday" class="error">
            {{ errors.birthday }}
          </div>
          <b-form-input
            v-model="user.birthday"
            type="date"
            dark="true"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            locale="en"
          />
        </b-form-group>
        <b-form-group description="Bio">
          <div v-if="errors.bio" class="error">
            {{ errors.bio }}
          </div>
          <textarea
            id="text"
            v-model="user.bio"
            class="form-control"
            placeholder="Bio"
            @keydown="removeError('bio')"
          />
        </b-form-group>
        <button id="submit" @click="submit()">
          SUBMIT
        </button>
      </form>
    </div>
    <div v-else class="container mt-3">
      <h1>User not found</h1>
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

const USER_PROFILE_S_SCHEMA = 'ups'
const USER_PROFILE_V_SCHEMA = 'upv'

ajv.addSchema({
  type: 'object',
  properties: {
    fname: {
      transform: ['trim']
    },
    lname: {
      transform: ['trim']
    },
    bio: {
      transform: ['trim']
    }
  }
}, USER_PROFILE_S_SCHEMA)

ajv.addSchema({
  type: 'object',
  properties: {
    fname: {
      type: 'string',
      maxLength: 50
    },
    lname: {
      type: 'string',
      maxLength: 50
    },
    bio: {
      type: 'string',
      maxLength: 200
    },
    birthday: {
      type: ['string', 'null'],
      format: 'date'
    },
    gender: {
      type: ['string', 'null'],
      pattern: '^[mfop]$'
    }
  },
  required: []
}, USER_PROFILE_V_SCHEMA)

const customErrorMsg = {
  fname: {
    maxLength: 'Post title is too long (max 50)'
  },
  lname: {
    maxLength: 'Post text is too long (max 50)'
  },
  bio: {
    maxLength: 'Post text is too long (max 200)'
  }
}

export default {
  data () {
    return {
      is404: false,
      user: {
        username: this.$route.params.user,
        fname: '',
        lname: '',
        gender: null,
        birthday: null,
        bio: ''
      },
      errors: {},
      submitting: false,
      genderOptions: [
        { value: null, text: 'Select gender' },
        { value: 'm', text: 'Male' },
        { value: 'f', text: 'Female' },
        { value: 'o', text: 'Other' },
        { value: 'p', text: 'Prefer not to say' }
      ]
    }
  },

  middleware: ['auth', 'owner'],

  beforeMount () {
    this.getUser()
  },

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    // TODO: update this validate
    validate () {
      ajv.validate(USER_PROFILE_S_SCHEMA, this.user)
      const validate = ajv.validate(USER_PROFILE_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = customErrors(ajvErrors(ajv), customErrorMsg)
        return false
      }
      return true
    },

    async submit () {
      if (this.submitting) { return }
      this.submitting = true

      try {
        const { user: username } = this.$route.params
        const user = { ...this.user }

        const res = await this.$axios.patch(`/api/user/profile/${username}`, user)
        if (res.status !== 200) { return }

        this.$router.push(`/u/${username}`)
      } catch (err) {
        const { status, data } = err.response

        if (status === 401) {
          this.errors = customErrors(data.errors, customErrorMsg)
        }
      }

      this.submitting = false
    },

    async getUser () {
      try {
        const { user: username } = this.$route.params

        const res = await this.$axios.get(`/api/user/profile/${username}`)
        const { user } = res.data
        this.$set(this, 'user', user)
      } catch (err) {
        const { status } = err.response

        if (status === 404) {
          this.$set(this, 'is404', true)
          // this.errors = customErrors(data.errors, customErrorMsg)
        }
      }
    }
  },

  head: {
    title: 'Edit Profile'
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

input, input:focus, textarea, textarea:focus, select {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus, textarea:focus, select:focus {
  box-shadow: none;
}

#submit {
  float: right;
}
</style>
