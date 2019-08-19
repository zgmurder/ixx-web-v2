<template>
  <div class="layout">
    <app-nav :nav-data-arr="navDataArr" />
    <router-view />
    <app-footer />
  </div>
</template>

<script>
import appNav from './appNav/index'
import appFooter from './appFooter/index'
export default {
  name: 'Layout',
  components: {
    appNav,
    appFooter
  },
  data(vm) {
    const routes = [...vm.$router.options.routes]
    const mapNavList = vm.$i18n.messages['zh-CN'].appNav.mapNavList
    const navDataArr = Object.keys(mapNavList).map(key => {
      const index = routes.findIndex(item => item.name === key)
      if (index === -1) return {}
      const matchRoute = routes.splice(index, 1)[0]
      return {
        lable: vm.$t(key),
        path: matchRoute.path
      }
    })
    return {
      navDataArr
    }
  }
}
</script>
