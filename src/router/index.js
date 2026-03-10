import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/views/LoginView.vue'
import ProviderLoginView from '../components/views/ProviderLoginView.vue'
import DashboardView from '../components/views/DashboardView.vue'
import Layout from '../components/layouts/Layout.vue'
// import { auth } from '../auth'
import { useAuthStore } from '../auth'
import LayoutFront from '../components/layouts-frontend/Layout.vue'
import FrontEndDashboardView from '../components/views/FrontEndDashboardView.vue'
import Practice from '../components/layouts-frontend/practice.vue'
import Exam from '../components/layouts-frontend/exam.vue'
import PrepareExam from '../components/layouts-frontend/prepareExam.vue'
import ExamResult from '../components/layouts-frontend/examResult.vue'
import questionsAnswer from '../components/layouts/questionsAnswer.vue'
import ProviderTopicView from '../components/views/ProviderTopicView.vue'

const routes = [

  {
    path: '/',
    name: '',
    component: LayoutFront,
    children: [
      {
        path: '',
        name: 'dashboard-front',
        component: FrontEndDashboardView
      },
      {
        path: 'practice/:topic',
        name: 'practice',
        component: Practice
      },
      {
        path: 'prepare-exam/:topic',
        name: 'prepare-exam',
        meta: { requiresAuth: true,loginRoute: 'login' },
        component: PrepareExam
      },
      {
        path: 'exam/:topic',
        name: 'exam',
        meta: { requiresAuth: true,loginRoute: 'login' },
        component: Exam
      },
      {
        path: 'exam-result/:topic',
        name: 'examResult',
        meta: { requiresAuth: true,loginRoute: 'login' },
        component: ExamResult
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/provider-login',
    name: 'provider-login',
    component: ProviderLoginView
  },
  {
    path: '/provider/dashboard',
    component: Layout,
    meta: { requiresAuth: true,loginRoute: 'provider-login' },
    children: [
      {
        path: '',
        name: 'provider-dashboard',
        component: DashboardView
      },
      {
        path: '/provider/questions-answer/:topic',
        name: 'provider-questions-answer',
        component: questionsAnswer
      },
      {
        path: '/provider/topic-questions/:topic',
        name: 'provider-topic',
        component: ProviderTopicView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated;

  
 const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {

    const loginRoute =
      to.matched.find(record => record.meta.loginRoute)?.meta.loginRoute || 'login'

    localStorage.setItem('intendedRoute', to.fullPath)

    next({
      name: loginRoute,
      query: { redirect: to.fullPath }
    })

  } else {
    next()
  }
});

export default router
