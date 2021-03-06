import { capitalizeLower, parseTime } from '@/utils'
import { bigRound } from '@/utils/handleNum'

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
    },
    bigRound,
    parseTime
  },
  filters: {
    parseTime,
    bigRound
  }
}
