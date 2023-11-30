<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="form.email">
      </div>
      <div>
        <label for="password">Password</label>
        <input type="text" v-model="form.password">
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '../stores/auth'

  const authStore = useAuthStore()

  const form = reactive({
    email: '',
    password: ''
  })

  const submitForm = () => {
    console.log(form)
    authStore.userLogin(form)
  }
</script>

<style lang="scss" scoped>

</style>