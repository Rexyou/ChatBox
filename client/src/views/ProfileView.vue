<template>
    <div>
        <h1>Profile page</h1>
        <img :src="profile.profile.image" alt="profile_image" style="height: 400px;width: auto;">
        <div>
            <label for="username">Username</label>
            <input type="text" v-model="profile.username" readonly>
        </div>
        <div>
            <label for="first_name">First Name</label>
            <input type="text" v-model="profile.first_name" readonly>
        </div>
        <div>
            <label for="last_name">Last Name</label>
            <input type="text" v-model="profile.last_name" readonly>
        </div>
        <div>
            <label for="email">Email</label>
            <input type="text" v-model="profile.email" readonly>
        </div>
    </div>
</template>

<script setup>
    import { useAuthStore } from '../stores/auth'
    import { getActivePinia } from 'pinia'

    const authStore = useAuthStore()
    let profile = authStore.authUserInfo;

    console.log(profile)

    // if(!profile || profile == null){
    //     getActivePinia()._s.forEach(store => store.$reset());
    // }

</script>

<style lang="scss" scoped>

</style>