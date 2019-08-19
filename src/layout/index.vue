<template>
  <div class="layout">
    <app-nav :nav-data-arr="navDataArr" />
    <router-view />
    <app-footer />
  </div>
</template>

<script>
// @ is an alias to /src
import appNav from './appNav/index'
import appFooter from './appFooter/index'

export default {
  name: 'Layout',
  components: {
    appNav,
    appFooter
  },
  data() {
    return {
      navDataArr: [
        {
          lable: this.$t('trading'),
          herf: 'ssss'
        },
        {
          lable: '合约交易',
          herf: 'ssss'
        },
        {
          lable: '法币交易',
          herf: 'ssss'
        },
        {
          lable: '市盈盈',
          herf: 'ssss'
        },
        {
          lable: '节点认购',
          herf: 'ssss'
        }
      ]
    }
  },
  created() {
    console.log(this)
  }
}
</script>
