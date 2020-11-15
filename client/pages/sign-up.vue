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
          <input id="username" v-model="user.username" type="text" class="form-control" placeholder="Username">
        </div>
        <div class="form-group">
          <input id="email" v-model="user.email" type="email" class="form-control" placeholder="Email Address">
        </div>
        <div class="form-group">
          <input id="password" v-model="user.password" type="password" class="form-control" placeholder="Password">
        </div>
        <div class="form-group">
          <input id="cpassword" v-model="user.cpassword" type="password" class="form-control" placeholder="Confirm Password">
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
import axios from 'axios'

import ajvErrors from '@/middleware/ajvErrors'

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

export default {
  data () {
    return {
      user: {
        username: 'username',
        password: 'Asdf1234',
        cpassword: 'Asdf1234',
        email: 'username@gmail.com'
      },
      errors: {}
    }
  },

  methods: {
    removeError (field) {
      delete this.errors[field]
    },

    validate () {
      ajv.validate(USER_S_SCHEMA, this.user)
      let validate = ajv.validate(USER_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = ajvErrors(ajv)
      }

      if (this.password !== this.cpassword) {
        this.errors.cpassword = 'Passwords are not the same'
        validate = false
      }

      return validate
    },

    submit () {
      // Get values from form
      if (this.validate) {
        const user = this.user
        delete user.cpassword

        axios.post('http://localhost:5000/api/user/create', {
          ...this.user
        })
          .then((res) => {
            if (res.status !== 201) {
              throw new Error('Error')
            }

            const { token } = res.data

            this.$store.commit('user/setToken', token)

            delete user.password
            user.fame = 0
            this.$store.commit('user/setUser', user)

            // FIXME:
            this.$router.push('/')
          })
          .catch((_err) => {
            alert('User not added')
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
.error {
  color: red;
}

.form-container {
  margin: 10vh auto 0 auto;
  width: 450px;
}

::placeholder {
  color: #C4C4C4;
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

#image {
  margin: 16px 0;
  border-radius: 50%;
}

#submit {
  float: right;
  background: transparent;
  color: #00C0FF;

  padding: 0.25rem 1rem;
  border: 2px solid #00C0FF;
  border-radius: 1rem;
}
</style>
