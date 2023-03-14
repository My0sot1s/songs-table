import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { wxLogin } from './request/wxAuth1'
import importVant from './tools/importVant'

Vue.config.productionTip = false
Vue.use(importVant)

window.addEventListener(
  'popstate',
  function (e) {
    router.isBack = true
  },
  false
)

wxLogin().then(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
})
