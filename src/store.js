import Vue from 'vue'
import Vuex from 'vuex'
import { getShareAccountList } from '@/api/share_option'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'zh-CN',
    userData: null,
    mapShareAccount: [],
    activeShareAccount: null
  },
  mutations: {
    CHANGE_LANG: (state, lang) => {
      state.locale = lang
    },
    SET_USERDATA: (state, userData) => {
      state.userData = userData
    },
    SET_MAPSHAREACCOUNT: (state, mapShareAccount) => {
      state.mapShareAccount = mapShareAccount
    },
    SET_ACTIVESHAREACCOUNT(state, activeShareAccount) {
      state.activeShareAccount = activeShareAccount
    }
  },
  actions: {
    async getShareAccountList({ commit, state }, id) {
      const res = await getShareAccountList(id)
      commit('SET_MAPSHAREACCOUNT', res.data)
      return res.data
    }
  }
})
