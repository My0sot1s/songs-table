import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/client/Home'
import MyApply from '@/views/client/MyApply'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  }, {
    path: '/home',
    component: Home
  }, {
    path: '/myApply',
    component: MyApply
  }
]

const router = new VueRouter({
  routes
})

export default router
