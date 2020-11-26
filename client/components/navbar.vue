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

      <div v-if="$auth.user">
        <div id="navbarResponsive" class="collapse navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <div class="nav-link">
                <img id="image" src="https://picsum.photos/24/24" width="24" height="24">
                /{{ $auth.user.username }}
                <span class="sr-only">(current)</span>
              </div>
            </li>
            <li class="nav-item">
              <nuxt-link id="create-station" class="nav-link" to="/create-station">
                Create station
              </nuxt-link>
            </li>
            <li class="nav-item">
              <div id="logout" class="nav-link" @click="$auth.logout()">
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
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
  cursor: pointer;
}

#login, #logout {
  color: #00C0FF;
  cursor: pointer;
}

#image {
  border-radius: 50%;
}
</style>
