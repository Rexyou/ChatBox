<template>
    <div>
        <h1>Chat List</h1>
        <div class="chat_contact_list">
            <div v-for="(item, index) in chatContactList" :key="index" class="chat_contact">
                <img v-if="item.sender_id._id != userInfo._id && item.sender_id.user_profile.image" :src="item.sender_id.user_profile.image" alt="sender_profile_image" class="user_profile_image">
                <img v-if="item.receiver_id._id != userInfo._id && item.receiver_id.user_profile.image" :src="item.receiver_id.user_profile.image" alt="receiver_profile_image" class="user_profile_image">
                <img v-if="!item.sender_id.user_profile.image || !item.receiver_id.user_profile.image" src="https://images.unsplash.com/photo-1603208228995-e1363f894188?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="default">
                <router-link :to="{ name: 'chat_content', params: { contact_id: item._id } }" target="_blank">
                    <h2 v-if="item.sender_id._id != userInfo._id">{{ item.sender_id.username }}</h2>
                    <h2 v-else>{{ item.receiver_id.username }}</h2>
                    <p>{{ item.messages.message }} at {{ item.messages.createdAt }}</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import { io } from 'socket.io-client'
    import { useAuthStore } from '../stores/auth';
    import { useChatStore } from '../stores/chat'

    const authStore = useAuthStore()
    const userInfo = authStore.authUserInfo
    const token = authStore.token

    const chatStore = useChatStore()
    const current_page_data = computed(()=> chatStore.currentContactPage)
    chatStore.getChatList(token, current_page_data.value);

    const chatContactList = computed(()=> chatStore.chat_contact_list)

    const socket = io('http://localhost:3900')

    socket.on('connect', () => {
        socket.on('chat_notification', async function(data) {
            chatStore.getChatList(token);
        });
    })

    socket.on('disconnect', () => {
        console.log('byebye')
    })
</script>

<style scoped>
    .chat_contact_list {
        display: flex;
        flex-direction: column;
    }

    .chat_contact {
        width: 90%;
        margin: 10px auto;
        border: 1px solid black;
        border-radius: 8px;
        padding: 5px 10px;
        display: flex;
        align-items: center;
    }

    .chat_contact img {
        height: 150px;
        width: auto;
        margin: 10px;
        border-radius: 8px;
    }
    
    .chat_contact a {
        text-decoration: none !important;
        color: black;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .chat_contact a:hover {
        color: green;
    }

    .chat_contact p {
        margin-top: 5px;
    }
</style>