<template>
  <div>
    <div class="container">
      <form @submit.prevent>
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="user.username" type="text" class="form-control" placeholder="Username">
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" v-model="user.email" type="email" class="form-control" placeholder="Email Address">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="user.password" type="password" class="form-control">
        </div>
        <div class="form-group">
          <label for="cpassword">Confirm Password</label>
          <input id="cpassword" v-model="user.cpassword" type="password" class="form-control">
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputEmail4">Email</label>
            <input id="inputEmail4" type="email" class="form-control">
          </div>
          <div class="form-group col-md-6">
            <label for="inputPassword4">Password</label>
            <input id="inputPassword4" type="password" class="form-control">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputCity">City</label>
            <input id="inputCity" type="text" class="form-control">
          </div>
          <div class="form-group col-md-4">
            <label for="inputState">State</label>
            <select id="inputState" class="form-control">
              <option selected>
                Choose...
              </option>
              <option>...</option>
            </select>
          </div>
          <div class="form-group col-md-2">
            <label for="inputZip">Zip</label>
            <input id="inputZip" type="text" class="form-control">
          </div>
        </div>
        <button type="submit" class="btn btn-primary">
          Sign in
        </button>
      </form>
    </div>
    <!-- <form @submit.prevent>
      <span v-if="errors.username" class="error">
        {{ errors.username }}
      </span>
      <label for="username">Username</label>
      <input
        v-model="user.username"
        type="text"
        @keydown="removeError('username')"
      >

      <br>

      <span v-if="errors.fname" class="error">
        {{ errors.fname }}
      </span>
      <label for="fname">First Name</label>
      <input
        v-model="user.fname"
        type="text"
        @keydown="removeError('fname')"
      >

      <span v-if="errors.lname" class="error">
        {{ errors.lname }}
      </span>
      <label for="lname">Last Name</label>
      <input
        v-model="user.lname"
        type="text"
        @keydown="removeError('lname')"
      >

      <br>

      <span v-if="errors.email" class="error">
        {{ errors.email }}
      </span>
      <label for="email">Email</label>
      <input
        v-model="user.email"
        type="email"
        @keydown="removeError('email')"
      >

      <br>

      <span v-if="errors.password" class="error">
        {{ errors.password }}
      </span>
      <label for="password">Password</label>
      <input
        v-model="user.password"
        type="password"
        @keydown="removeError('password')"
      >

      <span v-if="errors.cpassword" class="error">
        {{ errors.cpassword }}
      </span>
      <label for="cpassword">Confirm Password</label>
      <input
        id="cpassword"
        v-model="user.cpassword"
        type="password"
        @keydown="removeError('cpassword')"
      >

      <span v-if="errors.gender" class="error">
        {{ errors.gender }}
      </span>
      <label for="gender">Gender</label>
      <select
        id="gender"
        v-model="user.gender"
        @keydown="removeError('gender')"
      >
        <option value="f">
          Female
        </option>
        <option value="m">
          Male
        </option>
        <option value="o">
          Other
        </option>
      </select>

      <span v-if="errors.birthday" class="error">
        {{ errors.birthday }}
      </span>
      <label for="birthday">Birthday</label>
      <input
        v-model="user.birthday"
        type="date"
        @keydown="removeError('bio')"
      >

      <span v-if="errors.bio" class="error">
        {{ errors.bio }}
      </span>
      <label for="bio">Bio</label>
      <textarea
        id="bio"
        v-model="user.bio"
        @keydown="removeError('bio')"
      />
      <button @click="validate()">
        REGISTER
      </button>
    </form> -->
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
    },
    fname: {
      type: 'string',
      minLength: 1,
      maxLength: 50
    },
    lname: {
      type: 'string',
      minLength: 1,
      maxLength: 50
    },
    gender: {
      type: 'string',
      pattern: '^(m|f)$'
    },
    birthday: {
      type: 'string',
      format: 'date'
    },
    bio: {
      type: 'string',
      minLength: 1,
      maxLength: 200
    }
  },
  required: [
    'username',
    'password',
    'email',
    'fname',
    'lname',
    'gender',
    'birthday',
    'bio'
  ]
}, USER_V_SCHEMA)

export default {
  data () {
    return {
      user: {
        username: 'username',
        password: 'Asdf1234',
        cpassword: 'Asdf1234',
        email: 'username@gmail.com',
        fname: 'User',
        lname: 'Name',
        gender: 'f',
        birthday: '1999-12-16',
        bio: 'My name Jeff'
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
      const validate = ajv.validate(USER_V_SCHEMA, this.user)

      if (!validate) {
        this.errors = ajvErrors(ajv)
        if (this.password !== this.cpassword) { this.errors.cpassword = 'Passwords are not the same' }
        return
      }

      if (this.password !== this.cpassword) {
        this.errors.cpassword = 'Passwords are not the same'
        return
      }

      this.submit()
    },

    submit () {
      // Get values from form
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
</style>
