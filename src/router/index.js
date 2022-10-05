import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/client/Home'
import MyApply from '@/views/client/MyApply'
import AdminHome from '@/views/admin/Home'
import ApplyList from '@/views/admin/ApplyList'
import Setting from '@/views/admin/Setting'
import Examine from '@/views/admin/Examine'

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
  }, {
    path: '/admin',
    component: AdminHome
  }, {
    path: '/admin/home',
    component: AdminHome
  }, {
    path: '/admin/applyList',
    component: ApplyList
  }, {
    path: '/admin/setting',
    component: Setting
  }, {
    path: '/admin/examine',
    component: Examine
  }
]

const router = new VueRouter({
  routes
})

export default router
