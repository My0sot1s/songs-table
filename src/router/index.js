import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/tourist',
    redirect: '/home'
  },
  {
    name: 'Home',
    path: '/home',
    component: () => import('@/views/client/Home')
  },
  {
    name: 'Error',
    path: '/error',
    component: () => import('@/views/client/Error')
  },
  {
    name: 'MyApply',
    path: '/myApply',
    meta: {
      name: '我的申请',
      leftArrow: true
    },
    component: () => import('@/views/client/MyApply')
  },
  {
    name: 'SelectMusic',
    path: '/selectMusic',
    meta: {
      name: '点歌',
      leftArrow: true
    },
    component: () => import('@/views/client/SelectMusic')
  },
  {
    name: 'Admin',
    path: '/admin',
    redirect: '/admin/home'
  },
  {
    name: 'AdminHome',
    path: '/admin/home',
    meta: {
      name: '歌单列表',
      leftArrow: false
    },
    component: () => import('@/views/admin/Home')
  },
  {
    name: 'ApplyList',
    path: '/admin/applyList',
    meta: {
      name: '申请列表',
      leftArrow: false
    },
    component: () => import('@/views/admin/ApplyList')
  },
  {
    name: 'Setting',
    path: '/admin/setting',
    meta: {
      name: '管理',
      leftArrow: false
    },
    component: () => import('@/views/admin/Setting')
  },
  {
    name: 'Forbid',
    path: '/admin/forbid',
    meta: {
      name: '禁止点歌时间段',
      leftArrow: true
    },
    component: () => import('@/views/admin/Forbid')
  },
  {
    name: 'Examine',
    path: '/admin/examine',
    meta: {
      name: '申请详情',
      leftArrow: true
    },
    component: () => import('@/views/admin/Examine')
  },
  {
    name: 'ManageAdmin',
    path: '/admin/manageAdmin',
    meta: {
      name: '管理员设置',
      leftArrow: true
    },
    component: () => import('@/views/admin/ManageAdmin')
  }
]

const router = new VueRouter({
  routes
})

export default router
