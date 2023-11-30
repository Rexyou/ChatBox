import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChartListView from '../views/ChartListView.vue'

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
      component: ChartListView
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

    if(from.name != undefined){
      return { name: from.name }
    }
    else {
      return { name: 'chart_list' }
    }

  }

});

export default router
