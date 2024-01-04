<template>
    <div class="container">
        <div class="title">
            <h1>{{ receiver_name }}</h1>
            <h2>Room ID: {{ contact_id  }}</h2>
        </div>
        <router-link :to="{ name: 'chat_list' }" class="back_button" @click="disconnectedConnection">
            <span>Back to home</span>
        </router-link>
        <div ref="messages" id="messages">
            <li v-for="(item, index) in chat_list" :key="index">
                {{ `${item.message} by ${item.send_from_user.username} at ${ item.createdAt }` }}
            </li>
        </div>
        <form id="form" @submit.prevent="">
            <input id="input" autocomplete="off" />
            <button>Send</button>
        </form>
    </div>
</template>

<script setup>
    import { computed, ref, nextTick, onMounted } from 'vue'
    import { io } from 'socket.io-client'
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from '../stores/auth'
    import { useChatStore } from '../stores/chat'
    import { useContactStore } from '../stores/contact' 
    
    const authStore = useAuthStore()
    const token = authStore.token
    const userInfo = authStore.authUserInfo

    const route = useRoute()
    const router = useRouter()
    const messages = ref(null);
    const contact = computed(()=> route.params.contact_id)
    const contact_id = contact.value

    // Initial step
    const chatStore = useChatStore()
    chatStore.getChatHistory(token, contact_id, 1);
    let chat_list = computed(() => chatStore.chat_list);
    const current_page_data = computed(() => chatStore.currentPage)
    const next_page_data = computed(() => chatStore.nextPage)

    const contactStore = useContactStore()
    const contactList = contactStore.contactList

    const newList = contactList.filter((item)=> {
        return item._id == contact_id
    })

    if(newList.length == 0){
        router.push({ name: "chat_list" })
    }

    let receiver_name = "Receiver";
    if(newList[0].sender_id._id != userInfo._id){
        receiver_name = newList[0].sender_id.username;
    }

    if(newList[0].receiver_id._id != userInfo._id){
        receiver_name = newList[0].receiver_id.username;
    }

    if(newList[0].sender_id._id != userInfo._id && newList[0].receiver_id._id != userInfo._id){
        router.push({ name: "chat_list" })
    }

    const socket = io('http://localhost:3900')

    onMounted(async() => {
        setTimeout(()=> { messages.value.lastElementChild?.scrollIntoView({ behavior: 'smooth' }) }, 200);

        // Run recorder to know current live user
        socket.emit('recorder', { contact_id, userInfo });
    })

    window.addEventListener('scroll', async ()=> {
        const current_position = window.scrollY
        if(current_position == 0){
            if(next_page_data.value != null && current_page_data.value < next_page_data.value){
                chatStore.getChatHistory(token, contact_id, next_page_data.value);
            }
        }
    })

    socket.on('connect', () => {

        var form = document.getElementById('form');
        var input = document.getElementById('input');

        form.addEventListener('submit', async function(e) {
            if (input.value) {
                socket.emit('chat message', { msg: input.value, userInfo, contact_id });
                input.value = '';
                await nextTick();
                messages.value.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
            }
        });

        socket.on('chat_message', async function(data) {
            if(data.contact_id == contact_id){
                chatStore.chat_list.push(data)  
                await nextTick();
                messages.value.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
            }
        });

    })

    socket.on('disconnect', () => {
        console.log('byebye')
    })

    // Manual disconnect
    const disconnectedConnection = () => {
        socket.emit('disconnect_connection');
    }

</script>

<style scoped>
    body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

    .title {
        position: fixed;
        width: 100%;
        height: 6rem;
        top: 0;
        text-align: center;
        background: black;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
    }

    .title h1 {
        font-size: 30px;
    }

    .title h2 {
        font-size: 22px;
    }

    #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 6vh; box-sizing: border-box; backdrop-filter: blur(10px); }
    #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
    #input:focus { outline: none; }
    #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

    #messages { list-style-type: none; margin: 0; padding: 0; margin-bottom: 3rem; margin-top: 8rem; }
    #messages > li { padding: 0.5rem 1rem; }
    #messages > li:nth-child(odd) { background: #ffa743!important; }

    .back_button {
        position: fixed;
        color: black;
        height: 2rem;
        width: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 6rem;
        text-decoration: none;
    }

    .back_button:hover {
        color: white;
        background: green;
    }
</style>