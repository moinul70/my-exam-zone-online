import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView.vue'
import DashboardView from '../components/DashboardView.vue'
import { auth } from '../auth'
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component:DashboardView
    // Lazy-load this component for better performance
   // component: () => import('../components/DashboardView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



// ... existing router config ...

router.beforeEach((to, from, next) => {
    console.log(auth.isAuthenticated);
  if (to.path === '/dashboard' && auth.isAuthenticated) {
    next('/') // Redirect to login if authenticated
  } else {
    next()
  }
})

export default router
