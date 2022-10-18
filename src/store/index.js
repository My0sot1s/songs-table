import Vue from 'vue'
import Vuex from 'vuex'
// import { getList } from '@/api'
// import { Dialog } from 'vant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navText: '',
    leftArrow: false,
    applyList: []
  },
  getters: {},
  mutations: {
    changeNavText(state, text) {
      state.navText = text
    },
    changeLeftArrow(state, flag) {
      state.leftArrow = flag
    },
    noPassApply(state, id) {
      for (let i = 0; i < state.applyList.length; i++) {
        if (state.applyList[i].id === id) {
          state.applyList[i].state = 2
          break
        }
      }
    },
    passApply(state, id) {
      for (let i = 0; i < state.applyList.length; i++) {
        if (state.applyList[i].id === id) {
          state.applyList[i].state = 3
          break
        }
      }
    },
    pushApply(state, apply) {
      state.applyList.push(apply)
    }
  },
  actions: {},
  modules: {}
})
