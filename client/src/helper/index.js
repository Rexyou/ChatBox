import { useAuthStore } from '../stores/auth'

const clearStorage = () => {

    const authStore = useAuthStore()
    authStore.token = null
    authStore.authUserInfo = null

    window.sessionStorage.clear()
    window.localStorage.clear()

    return
}

export default {
    clearStorage
}