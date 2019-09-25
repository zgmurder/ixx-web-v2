import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'zh-CN',
    userData: null
  },
  mutations: {
    CHANGE_LANG: (state, lang) => {
      state.locale = lang
    },
    SET_USERDATA: (state, userData) => {
      state.userData = userData
    }
  }
})
