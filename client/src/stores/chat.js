import { defineStore } from 'pinia'
import axiosInstance from '../config'

export const useChatStore = defineStore('chat', {
    state: ()=> ({
        currentPage: 1,
        chat_list: [],
        totalPage: 0,
        nextPage: null
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

                    // Manage chat list
                    if(page == 1 && this.chat_list != []) {
                        this.chat_list = []
                    }

                    // if(this.chat_list != [] && this.currentPage != 1){
                    //     this.chat_list.unshift(...response.data.data.docs)
                    // }
                    this.chat_list.unshift(...response.data.data.docs)

                    // Recorder
                    this.totalPage = response.data.data.totalPages 
                    this.currentPage = response.data.data.page 
                    this.nextPage = response.data.data.nextPage 
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