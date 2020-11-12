<template>
  <div class="container">
    <navbar />
    <form method="POST">
      <label for="username">Username</label>
      <input name="username" type="text">
      <br>
      <label for="fname">First Name</label>
      <input name="fname" type="text">
      <label for="lname">Last Name</label>
      <input name="lname" type="text">
      <br>
      <label for="email">Email</label>
      <input name="email" type="email">
      <br>
      <label for="password">Password</label>
      <input name="password" type="password">
      <label for="cpassword">Confirm Password</label>
      <input name="cpassword" type="password">
    </form>
  </div>
</template>

<script>
import axios from '@nuxtjs/axios'

export default {
  methods: {
    submit () {
      axios.post('http://localhost:5000/api/user/register', {
        username: 'silentrald',
        password: 'ASDF1234',
        fname: 'Gerald',
        lname: 'Dalan'
      })
        .then((res) => {
          if (res.statusCode === 201) {
            // User has been created, TODO: Redict user
          }
        })
        .catch((err) => {
          /* eslint-disable */
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
