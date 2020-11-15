<template>
  <div>
    <div class="success">
      Account has been registered
      <nuxt-link to="/login">
        <button id="login">
          L O G I N
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped>
.success {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: baseline;

  width: 50%;
  margin: 10vh auto 0 auto;
  font-size: 64px;
}

#login {
  margin-top: 16px;
  width: 100px;
  font-size: medium;
}
</style>
