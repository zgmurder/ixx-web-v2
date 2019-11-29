import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'normalize.css'
import 'flex.css'
import 'hover.css'

import ElementUI from 'element-ui'

import '@/styles/index.scss' // global css
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
import koLocale from 'element-ui/lib/locale/lang/ko'

import './icons' // icon
import router from './router'

import './permission'

import mixins from './mixins'
Vue.mixin(mixins)

// Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import en from './lang/en'
import ko from './lang/ko'
import zhCN from './lang/zh-CN'
import zhHK from './lang/zh-HK'

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh-CN', // 语言标识
  silentFallbackWarn: true,
  messages: {
    'en': { ...en, ...enLocale },
    'ko': { ...ko, ...koLocale },
    'zh-CN': { ...zhCN, ...zhLocale },
    'zh-HK': { ...zhHK, ...twLocale }
  }
})
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.$eventBus = new Vue({})

new Vue({
  router,
  store,
  i18n,
  data: { modelVisible: false },
  render: h => h(App)
}).$mount('#app')

