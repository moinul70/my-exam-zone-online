import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/views/LoginView.vue'
import DashboardView from '../components/views/DashboardView.vue'
import Layout from '../components/layouts/Layout.vue'
import { auth } from '../auth'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: Layout,
    //meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next('/')
//   } else {
//     next()
//   }
// })

export default router
