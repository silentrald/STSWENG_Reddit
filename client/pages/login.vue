<template>
  <div>
    <div class="form-container">
      <form @submit.prevent>
        <h1>Login</h1>
        Login to your account
        <br>
        <br>
        <div class="form-group">
          <div v-if="error" class="error">
            Invalid Credentials
          </div>
          <input
            id="username"
            v-model="user.username"
            type="text"
            class="form-control"
            placeholder="Username"
          >
        </div>
        <div class="form-group">
          <input
            id="password"
            v-model="user.password"
            type="password"
            class="form-control"
            placeholder="Password"
          >
        </div>
        <button id="login" @click="login()">
          LOGIN
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-keywords')(ajv, ['transform'])

const LOGIN_S_SCHEMA = 'ls'
const LOGIN_V_SCHEMA = 'lv'

ajv.addSchema({
  type: 'object',
  properties: {
    username: {
      transform: ['trim']
    }
  }
}, LOGIN_S_SCHEMA)

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
      maxLength: 256
    }
  },
  required: [
    'username',
    'password'
  ]
}, LOGIN_V_SCHEMA)

export default {
  data () {
    return {
      user: {
        username: 'username',
        password: 'Asdf1234'
      },
      error: false
    }
  },

  middleware: ['notAuth'],

  methods: {
    validate () {
      ajv.validate(LOGIN_S_SCHEMA, this.user)
      const validate = ajv.validate(LOGIN_V_SCHEMA, this.user)

      this.error = !validate

      return validate
    },

    login () {
      if (this.validate()) {
        this.$auth.loginWith('local', { data: this.user })
          .then((res) => {
            if (res.status === 200) {
              this.$router.push('/')
            }
          })
          .catch((_err) => {
            this.error = true
          })
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  margin: 10vh auto 0 auto;
  width: 450px;
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

#login {
  float: right;
}
</style>
