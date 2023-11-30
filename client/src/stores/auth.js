import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '../config/index'

export const useAuthStore = defineStore('auth', {
  state: ()=> ({
    token: null,
    authUserInfo: null
  }),
  persist: {
      storage: sessionStorage,
  },
  getters: {
    userDetails: (state)=> state.authUserInfo
  },
  actions: {
    async userLogin(data) {
      try {
        
        await axiosInstance.post('/user/login', { email: data.email, password: data.password })
        .then((response)=> {
          this.token = response.data.data
          this.router.push({ name: 'profile' }); 
        })
        .catch((error)=> {
          console.log(error)
        })

      } catch (error) {
        console.log("try catch")
        console.log(error)
      }
    },
  }
})
