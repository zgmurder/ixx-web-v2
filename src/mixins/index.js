import { capitalizeLower, parseTime } from '@/utils'
import { bigRound, toBig, toRound, toFixed, toThousand } from '@/utils/handleNum'
import store from '@/store'
export default {
  computed: {
    thisName() {
      return capitalizeLower(this.$options.name)
    },
    langData() {
      return this.allLangData[this.thisName]
    },
    allLangData() {
      const locale = this.$i18n.locale
      return this.$i18n.messages[locale]
    },
    isLogin() {
      return !!this.$store.state.userData
    }
  },
  methods: {
    gotoPath(path) {
      this.$router.push(path)
    },
    $tR(keyPath, locale) {
      return this.$t(`${capitalizeLower(this.thisName)}.${keyPath}`, locale)
    },
    bigRound,
    parseTime
  },
  directives: {
    login: {
      // 指令的定义
      inserted: function(el, binding, vnode) {
        if (!store.state.userData) {
          const domDiv = document.createElement('div')
          const context = vnode.context
          const loginText = context.$t('login.login_by_count')
          const registerText = context.$t('login.register_count')
          domDiv.className = 'directive-login'
          domDiv.innerHTML = `
            <div class="el-button el-button--primary">${loginText}</div>
            <div class="el-button">${registerText}</div>
          `
          el.append(domDiv)
          domDiv.addEventListener('click', e => {
            if (e.target.innerText === loginText)context.$router.push({ path: '/user/login', query: { redirect: context.$route.path }})
            else if (e.target.innerText === registerText)context.$router.push({ path: '/user/register', query: { redirect: context.$route.path }})
          })
        }
      }
    }
  },
  filters: {
    parseTime,
    bigRound,
    toBig,
    toRound,
    toFixed,
    toThousand
  }
}
