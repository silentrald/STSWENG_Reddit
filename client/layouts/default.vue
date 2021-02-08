<template>
  <div>
    <Navbar />
    <Nuxt />
  </div>
</template>

<style>
:root {
  --red: #FF3232;
  --black: #01021E;
  --green: #
}

body {
  font-family: 'Lato', sans-serif;
  color: #FFF;
  background-color: var(--black);

  margin: 0;
  padding: 0;
}

a {
  color: white;
}

button, .modal-footer > .btn {
  background: transparent;
  color: #00C0FF;

  padding: 0.25rem 1rem;
  border: 2px solid #00C0FF;
  border-radius: 1rem;
}

.modal-footer > .btn-danger, .modal-footer > .btn-outline-danger {
  color: #DC3545;
  border-color: #DC3545;
}

.background {
  background-color: #01021E;
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

.success {
  color: #99ff99;
  font-size: 14px;
  font-style: italic;
}

.error {
  color: var(--red);
  font-size: 14px;
  font-style: italic;
}
</style>
