<template>
    <div class="container">
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
    import { computed, onMounted, reactive, ref, nextTick } from 'vue'
    import { io } from 'socket.io-client'
    import { useRoute } from 'vue-router'
    import { useAuthStore } from '../stores/auth'
    import { useChatStore } from '../stores/chat'
    
    const authStore = useAuthStore()
    const token = authStore.token
    const userInfo = authStore.authUserInfo

    const route = useRoute()
    const messages = ref(null);
    const contact = computed(()=> route.params.contact_id)
    const contact_id = contact.value

    // Initial step
    const chatStore = useChatStore()
    chatStore.getChatHistory(token, contact_id, 1);
    let chat_list = computed(() => chatStore.chat_list);
    
    onMounted(async() => {
        messages.value.lastElementChild.scrollIntoView({ behavior: 'smooth' })
    })

    const state = reactive({
        connected: false
    })

    const socket = io('http://localhost:3900')

    socket.on('connect', () => {
        state.connected = true

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
            chatStore.chat_list.push(data)
            await nextTick();
            messages.value.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
        });

    })

    socket.on('disconnect', () => {
        state.connected = false
    })

</script>

<style scoped>
    body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

    #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 6vh; box-sizing: border-box; backdrop-filter: blur(10px); }
    #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
    #input:focus { outline: none; }
    #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

    #messages { list-style-type: none; margin: 0; padding: 0; margin-bottom: 3rem !important; }
    #messages > li { padding: 0.5rem 1rem; }
    #messages > li:nth-child(odd) { background: #ffa743!important; }
</style>