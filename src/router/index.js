import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/client/Home'
import MyApply from '@/views/client/MyApply'
import SelectMusic from '@/views/client/SelectMusic'
import Login from '@/views/admin/Login'
import AdminHome from '@/views/admin/Home'
import ApplyList from '@/views/admin/ApplyList'
import Setting from '@/views/admin/Setting'
import Forbid from '@/views/admin/Forbid'
import Examine from '@/views/admin/Examine'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    name: 'Home',
    path: '/home',
    component: Home
  },
  {
    name: 'MyApply',
    path: '/myApply',
    component: MyApply
  },
  {
    name: 'SelectMusic',
    path: '/selectMusic',
    component: SelectMusic
  },
  {
    name: 'Admin',
    path: '/admin',
    redirect: '/admin/login'
  },
  {
    name: 'AdminLogin',
    path: '/admin/login',
    component: Login
  },
  {
    name: 'AdminHome',
    path: '/admin/home',
    component: AdminHome
  },
  {
    name: 'ApplyList',
    path: '/admin/applyList',
    component: ApplyList
  },
  {
    name: 'Setting',
    path: '/admin/setting',
    component: Setting
  },
  {
    name: 'Forbid',
    path: '/admin/forbid',
    component: Forbid
  },
  {
    name: 'Examine',
    path: '/admin/examine',
    component: Examine
  }
]

const router = new VueRouter({
  routes
})

export default router
