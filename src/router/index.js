import Vue from 'vue'
import VueRouter from 'vue-router'
import myHome from '@/views/myHome'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'myHome'
  },
  {
    path: '/myHome',
    component: myHome
  }
]

const router = new VueRouter({
  routes
})

export default router
