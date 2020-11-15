<template>
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<script>
export default {
  head: {
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com'
      }, {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap'
      }
    ]
  }
}
</script>

<style>
body {
  font-family: 'Lato', sans-serif;
  color: #FFF;
  background-color: #01021E;

  margin: 0;
  padding: 0;
}
</style>
