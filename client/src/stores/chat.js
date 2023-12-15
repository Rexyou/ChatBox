import { defineStore } from 'pinia'
import axiosInstance from '../config'

export const useChatStore = defineStore('chat', {
    state: ()=> ({
        page: 1,
        chat_list: [],
        totalPage: 0
    }),
    persist: {
        storage: sessionStorage,
    },
    actions: {
        async getChatHistory(token, contact_id, page){

            try {
                
                await axiosInstance.get(`/chat/get_messages/${contact_id}?page=${page}`, { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=> {
                    this.chat_list = response.data.data.docs
                    this.totalPage = response.data.data.totalPages 
                })
                .catch((error)=> {
                    console.log(error)
                })

            } catch (error) {
                console.log(error)
            }

        }
    }
})