<template>
  <div>
    <div class="form-container">
      <form @submit.prevent>
        <h1>Sign Up</h1>
        Create your account
        <br>
        <img id="image" src="https://picsum.photos/100/100" width="100" height="100">
        <br>
        <div class="form-group">
          <div v-if="errors.username" class="error">
            {{ errors.username }}
          </div>
          <input
            id="username"
            v-model="user.username"
            type="text"
            class="form-control"
            placeholder="Username"
            @keydown="removeError('username')"
          >
        </div>
        <div class="form-group">
          <div v-if="errors.email" class="error">
            {{ errors.email }}
          </div>
          <input
            id="email"
            v-model="user.email"
            type="email"
            class="form-control"
            placeholder="Email Address"
            @keydown="removeError('email')"
          >
        </div>
        <div class="form-group">
          <div v-if="errors.password" class="error">
            {{ errors.password }}
          </div>
          <input
            id="password"
            v-model="user.password"
            type="password"
            class="form-control"
            placeholder="Password"
            @keydown="removeError('password')"
          >
        </div>
        <div class="form-group">
          <input
            id="cpassword"
            v-model="user.cpassword"
            type="password"
            class="form-control"
            placeholder="Confirm Password"
            @keydown="removeError('password')"
          >
        </div>
        <button id="submit" @click="submit()">
          SIGN UP
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Ajv from 'ajv'

import ajvErrors from '@/helpers/ajvErrors'
import customErrors from '@/helpers/customErrors'

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-keywords')(ajv, ['transform'])

const USER_S_SCHEMA = 'us'
const USER_V_SCHEMA = 'uv'

ajv.addSchema({
  type: 'object',
  properties: {
    username: {
      transform: ['trim']
    },
    email: {
      transform: ['trim']
    }
  }
}, USER_S_SCHEMA)

ajv.addSchema({
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 8,
      maxLength: 64
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 256,
      pattern: '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$'
    },
    email: {
      type: 'string',
      maxLength: 256,
      format: 'email'
    }
  },
  required: [
    'username',
    'password',
    'email'
  ]
}, USER_V_SCHEMA)

const customErrorMsg = {
  username: {
    maxLength: 'Username is too long (max 64)',
    minLength: 'Username is too short (min 8)',
    used: 'Username is already used'
  },
  email: {
    maxLength: 'Email is too long (max 256)',
    minLength: 'Email is too short (min 8)',
    format: 'Email is invalid'
  },
  password: {
    maxLength: 'Password is too long (max 256)',
    minLength: 'Password is too short (min 8)',
    pattern: 'Password is too weak'
  }
}

export default {
  data () {
    return {
      user: {
        username: 'username',
        password: 'Asdf1234',
        cpassword: 'Asdf1234',
        email: 'username@gmail.com'
      },
      errors: { }
    }
  },

  middleware: ['notAuth'],

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    validate () {
      ajv.validate(USER_S_SCHEMA, this.user)
      const validate = ajv.validate(USER_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = customErrors(ajvErrors(ajv), customErrorMsg)
        return false
      }

      if (this.user.password !== this.user.cpassword) {
        this.errors = { password: 'Passwords are not the same' }
        return false
      }

      return true
    },

    submit () {
      // Get values from form
      if (this.validate()) {
        const user = { ...this.user } // Deep clone
        delete user.cpassword

        this.$axios.post('/api/user/create', {
          ...this.user
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

input, input:focus {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus {
  box-shadow: none;
}

#submit {
  float: right;
}
</style>
