import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

const navMap = new Map([
  [undefined, { leftArrow: true, navText: '点歌台' }],
  ['Home', { leftArrow: true, navText: '点歌台' }],
  ['MyApply', { leftArrow: true, navText: '我的申请' }],
  ['SelectMusic', { leftArrow: true, navText: '点歌' }],
  ['Admin', { leftArrow: false, navText: '歌单列表' }],
  ['AdminHome', { leftArrow: false, navText: '歌单列表' }],
  ['Setting', { leftArrow: true, navText: '管理' }],
  ['ApplyList', { leftArrow: false, navText: '申请列表' }],
  ['Examine', { leftArrow: true, navText: '申请详情' }]
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

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
