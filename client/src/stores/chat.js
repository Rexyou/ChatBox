import { defineStore } from 'pinia'
import axiosInstance from '../config'
import helper from '../helper'

export const useChatStore = defineStore('chat', {
    state: ()=> ({
        chat_list: [],
        currentPage: 1,
        totalPage: 0,
        nextPage: null,
        chat_contact_list: [],
        currentContactPage: 1,
        totalContactPage: 0,
        nextContactPage: null
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
                    this.chat_list.unshift(...response.data.data.docs)

                    // Recorder
                    this.totalPage = response.data.data.totalPages 
                    this.currentPage = response.data.data.page 
                    this.nextPage = response.data.data.nextPage 
                })
                .catch((error)=> {
                    if(error.response.status == 401){
                        helper.clearStorage()
                    }
                })

            } catch (error) {
                console.log(error)
            }

        },
        async getChatList(token){
            try {
                
                await axiosInstance.get(`/contact/chat_list`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((response)=> {
                    this.chat_contact_list = response.data.data
                })
                .catch((error)=> {
                    if(error.response.status == 401){
                        helper.clearStorage()
                    }
                })

            } catch (error) {
                console.log(error)
            }
        },
    }
})