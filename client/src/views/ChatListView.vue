<template>
    <div>
        <h1>Chat List</h1>
        <div class="chat_contact_list">
            <div v-for="(item, index) in chatContactList" :key="index" class="chat_contact">
                <router-link :to="{ name: 'chat_content', params: { contact_id: item._id } }" target="_blank">
                    <h2 v-if="item.sender_id != userInfo._id">{{ item.sender_id }}</h2>
                    <h2 v-else>{{ item.receiver_id }}</h2>
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
    chatStore.getChatList(token);

    const chatContactList = computed(()=> chatStore.chat_contact_list)
    console.log(chatContactList.value)

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
    }
    
    .chat_contact a {
        text-decoration: none !important;
        color: black;
    }

    .chat_contact a:hover {
        color: green;
    }

    .chat_contact p {
        margin-top: 5px;
    }
</style>