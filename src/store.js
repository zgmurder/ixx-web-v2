import Vue from 'vue'
import Vuex from 'vuex'
import { getShareAccountList } from '@/api/share_option'
import { removeUser } from '@/utils/auth'
import { loginout } from '@/api/user'
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
    async getShareAccountList({ commit, state }, { accountArr, isAssignment }) {
      if (!state.userData) return
      const currenyArr = accountArr.map(item => item.currency).join(',')
      const res = await getShareAccountList(state.userData.id, currenyArr)
      const dataArr = res.data.map(item => {
        const found = accountArr.find(subItem => subItem.currency === item.currency)
        return { ...item, ...found }
      })
      commit('SET_MAPSHAREACCOUNT', dataArr)
      if (!isAssignment)commit('SET_ACTIVESHAREACCOUNT', dataArr[0])
      else {
        const found = dataArr.find(item => state.activeShareAccount.currency === item.currency)
        commit('SET_ACTIVESHAREACCOUNT', found)
      }
      return dataArr
    },
    async loginout() {
      await loginout()
      location.reload()
      removeUser()
      this.$store.commit('SET_USERDATA', null)
    }
  }
})
