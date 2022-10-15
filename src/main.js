import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import initAxios from './request'
import musicApi from './musicApi'
import {
  Button,
  Icon,
  Image as VanImage,
  Popup,
  Lazyload,
  Calendar,
  Cascader,
  Field,
  Form,
  Search,
  DropdownMenu,
  DropdownItem,
  Loading,
  Overlay,
  Divider,
  Empty,
  List,
  NoticeBar,
  Sticky,
  NavBar,
  Tabbar,
  TabbarItem
} from 'vant'

Vue.use(Button)
Vue.use(Icon)
Vue.use(VanImage)
Vue.use(Popup)
Vue.use(Lazyload)
Vue.use(Calendar)
Vue.use(Cascader)
Vue.use(Field)
Vue.use(Form)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Loading)
Vue.use(Search)
Vue.use(Overlay)
Vue.use(Divider)
Vue.use(Empty)
Vue.use(List)
Vue.use(NoticeBar)
Vue.use(Sticky)
Vue.use(NavBar)
Vue.use(Tabbar)
Vue.use(TabbarItem)

Vue.config.productionTip = false

const navMap = new Map([
  [undefined, { leftArrow: false, navText: '点歌台' }],
  ['Home', { leftArrow: true, navText: '点歌台' }],
  ['MyApply', { leftArrow: true, navText: '我的申请' }],
  ['SelectMusic', { leftArrow: true, navText: '点歌' }],
  ['Admin', { leftArrow: false, navText: '歌单列表' }],
  ['AdminHome', { leftArrow: false, navText: '歌单列表' }],
  ['Setting', { leftArrow: false, navText: '管理' }],
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

initAxios(Vue).then(() => {
  Vue.prototype.$musicApi = musicApi
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
})
