import { defineStore } from 'pinia'
import axiosInstance from '../config/index'
import { useContactStore } from './contact'

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
        .then(async (response)=> {
          this.token = response.data.data
          await this.userProfile()

          const contactStore = useContactStore();
          await contactStore.getContactList(this.token)
          await contactStore.getContactList(this.token, 0)

          await this.router.push({ name: 'profile' }); 
        })
        .catch((error)=> {
          console.log(error)
        })

      } catch (error) {
        console.log("try catch")
        console.log(error)
      }
    },
    async userProfile(){

      try {
        
        await axiosInstance.get('/user/profile', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        .then((response)=> {
          console.log(response.data)
          this.authUserInfo = response.data.data
        })
        .catch((error)=>{
          console.log(error)
        })

      } catch (error) {
        console.log("try catch")
        console.log(error)
      }

    }
  }
})
