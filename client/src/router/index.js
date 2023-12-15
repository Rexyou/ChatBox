import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChatListView from '../views/ChatListView.vue'
import ContactView from '../views/ContactView.vue'
import ChatContentView from '../views/ChatContentView.vue'
import { useContactStore } from '../stores/contact'
import { computed } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/',
      name: 'chat_list',
      component: ChatListView
    },
    {
      path: '/contact',
      name: 'contact_list',
      component: ContactView
    },
    {
      path: '/chat_room/:contact_id',
      name: 'chat_content',
      component: ChatContentView
    },
  ]
})

router.beforeEach(async (to, from) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['login', 'register'];
  const authRequired = !publicPages.includes(to.name);
  const authStore = useAuthStore()
  const contactStore = useContactStore()

  if (authRequired && (!authStore.token || authStore.token == null)) {
    return { name: 'login' }
  }
  else if(authStore.token && publicPages.includes(to.name)){

    let path = { name: from.name };
    if(from.name == undefined){
      path = { name: 'chat_list' }
    }

    return path

  }
  else if(authStore.token && to.name == "chat_content"){

    const token = authStore.token
    const contact_id = to.params.contact_id

    await contactStore.verifyContact(token, contact_id)
    const contact_room_verify = computed(()=> contactStore.contact_room_verify)
    if(!contact_room_verify.value){
      return { name: 'chat_list' }
    }
    
  }

});

export default router
