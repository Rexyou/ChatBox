<template>
    <div>
        <h1>Profile page</h1>
        <div v-if="profile.profile.image != null">
            <img :src="profile.profile.image" alt="profile_image" style="height: 400px;width: auto;">
        </div>
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
        <button @click.prevent="logout">Logout</button>
    </div>
</template>

<script setup>
    import { useAuthStore } from '../stores/auth'
    import { useRouter } from 'vue-router'

    const authStore = useAuthStore()
    let profile = authStore.authUserInfo;
    const router = useRouter();

    const logout = () => {
        window.localStorage.clear();
        window.sessionStorage.clear();
        authStore.token = null

        router.push({ name: 'login' })
    }

</script>

<style lang="scss" scoped>

</style>