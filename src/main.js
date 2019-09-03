import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'normalize.css'
import 'flex.css'

import ElementUI from 'element-ui'
import '@/styles/theme/index.css'
import '@/styles/index.scss' // global css
// import locale from 'element-ui/lib/locale/lang/en'
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import './icons' // icon
import router from './router/index'

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
  locale: 'zh-CN', // 语言标识
  silentFallbackWarn: true,
  messages: {
    en, ko,
    'zh-CN': zhCN,
    'zh-HK': zhHK
  }
})

Vue.prototype.$eventBus = new Vue({})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
