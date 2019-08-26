import { capitalizeLower } from '@/utils'
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
    $tR(keyPath) {
      return this.$t(`${capitalizeLower(this.thisName)}.${keyPath}`)
    }
  }
}
