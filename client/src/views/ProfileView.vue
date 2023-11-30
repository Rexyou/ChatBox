<template>
    <div>
        <h1>Profile page</h1>
    </div>
</template>

<script setup>
    import { useAuthStore } from '../stores/auth'

    const authStore = useAuthStore()

    console.log(authStore.token)
</script>

<style lang="scss" scoped>

</style>