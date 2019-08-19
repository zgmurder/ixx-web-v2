import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import 'flex.css'
import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
// import locale from 'element-ui/lib/locale/lang/en'
import './icons' // icon

Vue.use(ElementUI)
// Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
console.log(import('./lang/en'))

import en from './lang/en'
import ko from './lang/ko'
import zhCN from './lang/zh-CN'
import zhHK from './lang/zh-HK'

const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识
  messages: {
    en, ko,
    'zh-CN': zhCN,
    'zh-HK': zhHK
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
