import { capitalizeLower } from '@/utils'
import Big from 'big.js/big.mjs'

export default {
  computed: {
    thisName() {
      return capitalizeLower(this.$options.name)
    },
    chineseLangData() {
      return this.$i18n.messages['zh-CN'][this.thisName]
    }
  },
  methods: {
    gotoPath(path) {
      this.$router.push(path)
    },
    $tR(keyPath, locale) {
      return this.$t(`${capitalizeLower(this.thisName)}.${keyPath}`, locale)
    }
  }
}
