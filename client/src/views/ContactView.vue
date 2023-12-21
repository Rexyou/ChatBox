<template>
    <div>
        <h1>Contact page</h1>
        <div>
            <label for="search">Search New Contact</label>
            <input type="text" id="search" placeholder="Search for email, phone number, username etc...">
            <button @click.prevent="searchContact()">Search</button>
        </div>
        <div v-if="result_list_length > 0">
            <h2>Result List</h2>
            <ul>
                <li v-for="(result, index) in result_list" :key="index">
                    <input type="text" :value="result.username" readonly>
                    <button>View Profile</button>
                    <button @click.prevent="sendRequest(result._id)">Send Request</button>
                    <!-- <button @click.prevent="updateContactStatus(request._id, 1)">Accept</button> -->
                </li>
            </ul>
        </div>
        <div v-if="request_list_length > 0">
            <h2>Request List</h2>
            <ul>
                <li v-for="(request, index) in request_list" :key="index">
                    <div v-if="current_user._id == request.receiver_id._id">
                        <input type="text" :value="request.sender_id.username" readonly>
                        <button>View Profile</button>
                        <button @click.prevent="updateContactStatus(request._id, 1)">Accept</button>
                        <button @click.prevent="updateContactStatus(request._id, 2)">Reject</button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="contact_list_length > 0">
            <h2>Contact List</h2>
            <ul>
                <li v-for="(contact, index) in contact_list" :key="index">
                    <div v-if="current_user._id != contact.receiver_id._id">
                        <input type="text" :value="contact.receiver_id.username" readonly>
                        <button>View Profile</button>
                        <button>
                            <router-link :to="{ name: 'chat_content', params: { contact_id: contact._id } }">Chat</router-link>
                        </button>
                        <button @click.prevent="updateContactStatus(contact._id, 2)">Unfriend</button>
                        <button @click.prevent="updateContactStatus(contact._id, 3)">Block</button>
                    </div>
                    <div v-if="current_user._id == contact.receiver_id._id">
                        <input type="text" :value="contact.sender_id.username" readonly>
                        <button>View Profile</button>
                        <button>
                            <router-link :to="{ name: 'chat_content', params: { contact_id: contact._id } }">Chat</router-link>
                        </button>
                        <button @click.prevent="updateContactStatus(contact._id, 2)">Unfriend</button>
                        <button @click.prevent="updateContactStatus(contact._id, 3)">Block</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>

    import { useContactStore } from '../stores/contact'
    import { useAuthStore } from '../stores/auth'
    import { computed } from 'vue';
    
    const authStore = useAuthStore();
    const current_user = authStore.authUserInfo
    const token = authStore.token
    console.log(authStore.authUserInfo._id)
    console.log(authStore.authUserInfo.username)

    const contactStore = useContactStore()

    contactStore.getContactList(token)
    contactStore.getContactList(token, 0)

    const contact_list = computed(()=> contactStore.contactList)
    const contact_list_length = computed(()=> contact_list?.value.length)

    const request_list = computed(()=> contactStore.requestList)   
    const request_list_length = computed(()=> request_list?.value.length)

    const updateContactStatus = async (contact_id, status) => {
        await contactStore.updateStatus(token, { contact_id, status })
    }

    // Initial result list
    contactStore.resultList = {}
    const result_list = computed(()=> contactStore.resultList)
    const result_list_length = computed(()=> result_list?.value.length)

    const searchContact = async () => {
        const target_value = document.getElementById('search').value;
        await contactStore.searchContact(token, target_value)
    }

    const sendRequest = async (id) => {
        if(current_user.id == id){
            alert("same_id_not_allow")
        }

        await contactStore.sendFriendRequest(token, id)
    }

</script>

<style lang="scss" scoped>

</style>