import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navText: '',
    leftArrow: false
  },
  getters: {},
  mutations: {
    changeNavText(state, text) {
      state.navText = text
    },
    changeLeftArrow(state, flag) {
      state.leftArrow = flag
    }
  },
  actions: {},
  modules: {}
})
