import { defineStore } from 'pinia'
import axiosInstance from '../config'

export const useContactStore = defineStore('contact', {
    state: ()=> ({
        contactList: {},
        requestList: {},
        resultList: {},
        contact_room_verify: false
    }),
    persist: {
        storage: sessionStorage,
    },
    actions: {
        async getContactList(token, status=1){
            try {

                await axiosInstance.get(`/contact/list/${status}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=> {

                    if(status == 0){
                        this.requestList = response.data.data
                    }
                    else {
                        this.contactList = response.data.data
                    }

                })
                .catch((error)=>{
                    console.log(error)
                })
                
            } catch (error) {
                console.log(error)
            }
        },
        async updateStatus(token, data){

            try {

                await axiosInstance.post(`/contact/update_request/${data.contact_id}/${data.status}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(async (response)=> {
                    console.log(response)
                    await this.getContactList(token)
                    await this.getContactList(token, 0)
                })
                .catch((error)=> {
                    console.log(error)
                })
                
            } catch (error) {
                console.log(error)
            }

        },
        async searchContact(token, target_value){
            try {
                
                await axiosInstance.post('/contact/search', { target_value }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=> {
                    this.resultList = response.data.data
                })
                .catch(error=> {
                    console.log(error)
                })

            } catch (error) {
                console.log(error)
            }
        },
        async sendFriendRequest(token, receiver_id){

            try {

                await axiosInstance.post('/contact/send_request', { receiver_id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=> {
                    console.log(response)
                    alert("Request send!")
                })
                .catch((error)=> {
                    console.log(error)
                })
                
            } catch (error) {
                console.log(error)
            }

        },
        async verifyContact(token, contact_id){
            try {
                
                await axiosInstance.post('/contact/verify_contact', { contact_id }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((response)=> {
                    if(response.status){
                        this.contact_room_verify = true
                    }
                })
                .catch((error)=> {
                    console.log(error)
                    this.contact_room_verify = false
                })

            } catch (error) {
                console.log(error)
                this.contact_room_verify = false
            }
        },
    }

})