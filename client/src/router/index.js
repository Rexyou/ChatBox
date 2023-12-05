import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChatListView from '../views/ChatListView.vue'

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
      path: '/chat_list',
      name: 'chat_list',
      component: ChatListView
    },
  ]
})

router.beforeEach(async (to, from) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['login', 'register'];
  const authRequired = !publicPages.includes(to.name);
  const authStore = useAuthStore()

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

});

export default router
