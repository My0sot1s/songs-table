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
    component: () => import('@/views/client/MyApply')
  },
  {
    name: 'SelectMusic',
    path: '/selectMusic',
    component: () => import('@/views/client/SelectMusic')
  },
  {
    name: 'Admin',
    path: '/admin',
    redirect: '/admin/home'
  },
  {
    name: 'AdminLogin',
    path: '/admin/login',
    component: () => import('@/views/admin/Login')
  },
  {
    name: 'AdminHome',
    path: '/admin/home',
    component: () => import('@/views/admin/Home')
  },
  {
    name: 'ApplyList',
    path: '/admin/applyList',
    component: () => import('@/views/admin/ApplyList')
  },
  {
    name: 'Setting',
    path: '/admin/setting',
    component: () => import('@/views/admin/Setting')
  },
  {
    name: 'Forbid',
    path: '/admin/forbid',
    component: () => import('@/views/admin/Forbid')
  },
  {
    name: 'Examine',
    path: '/admin/examine',
    component: () => import('@/views/admin/Examine')
  }
]

const router = new VueRouter({
  routes
})

const navMap = new Map([
  [undefined, { leftArrow: false, navText: '' }],
  ['Home', { leftArrow: false, navText: '' }],
  ['MyApply', { leftArrow: true, navText: '我的申请' }],
  ['SelectMusic', { leftArrow: true, navText: '点歌' }],
  ['Admin', { leftArrow: false, navText: '歌单列表' }],
  ['AdminHome', { leftArrow: false, navText: '歌单列表' }],
  ['Setting', { leftArrow: false, navText: '管理' }],
  ['ApplyList', { leftArrow: false, navText: '申请列表' }],
  ['Examine', { leftArrow: true, navText: '申请详情' }],
  ['Forbid', { leftArrow: true, navText: '禁止点歌时间段' }]
])

router.beforeEach((to, from, next) => {
  const nav = navMap.get(to.name)
  if (nav) {
    router.app.$options.store.commit('changeNavText', nav.navText)
    router.app.$options.store.commit('changeLeftArrow', nav.leftArrow)
  } else {
    router.app.$options.store.commit('changeNavText', '')
    router.app.$options.store.commit('changeLeftArrow', false)
  }
  next()
})

export default router
