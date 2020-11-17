<template>
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<style>
body {
  font-family: 'Lato', sans-serif;
  color: #FFF;
  background-color: #01021E;

  margin: 0;
  padding: 0;
}

button {
  background: transparent;
  color: #00C0FF;

  padding: 0.25rem 1rem;
  border: 2px solid #00C0FF;
  border-radius: 1rem;
}

/* input, input:focus {
  background: transparent;
  color: #FFF;
  border: 2px solid #C4C4C4;
  border-radius: 0.5rem;
}

input:focus {
  box-shadow: none;
} */

::placeholder {
  color: #C4C4C4;
}

.error {
  color: red;
  font-size: 14px;
  font-style: italic;
}
</style>
