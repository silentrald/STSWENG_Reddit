<template>
  <nav class="navbar navbar-expand-lg static-top">
    <div class="container">
      <nuxt-link id="rocket" class="navbar-brand" to="/">
        <!-- TODO: Logo Here -->
        <b>R O C K E T</b>
      </nuxt-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarResponsive" class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <nuxt-link id="signup" class="nav-link" to="/sign-up">
              Sign Up
              <span class="sr-only">(current)</span>
            </nuxt-link>
          </li>
          <li id="login" class="nav-item">
            <nuxt-link class="nav-link" to="/login">
              Login
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style scoped>
.navbar {
  background-color: #01021E;
  box-shadow: 0 1px 5px #000;
}

#rocket, #signup {
  color: #FF3232;
}

#login {
  color: #00C0FF;
}
</style>
