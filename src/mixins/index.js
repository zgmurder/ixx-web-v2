import { capitalizeLower, parseTime } from '@/utils'
import { bigRound, toBig, toRound, toFixed, toThousand } from '@/utils/handleNum'
export default {
  computed: {
    thisName() {
      return capitalizeLower(this.$options.name)
    },
    langData() {
      const locale = this.$i18n.locale
      return this.$i18n.messages[locale][this.thisName]
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
    bigRound,
    toBig,
    toRound,
    toFixed,
    toThousand
  }
}
