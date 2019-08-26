<template>
  <div class="layout">
    <app-nav :nav-data-arr="navDataArr" />
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- <app-footer /> -->
  </div>
</template>

<script>
import appNav from './appNav/index'
// import appFooter from './appFooter/index'
import { getValueByPath } from '@/utils/index'
export default {
  name: 'Layout',
  components: {
    appNav
    // appFooter
  },
  data(vm) {
    const routes = [...vm.$router.options.routes]
    const path = 'appNav.mapNavList'
    const mapNavList = getValueByPath(vm.$i18n.messages['zh-CN'], path)
    const navDataArr = Object.keys(mapNavList).map(key => {
      const index = routes.findIndex(item => item.name === key)
      if (index === -1) return {}
      const matchRoute = routes.splice(index, 1)[0]
      return {
        keyPath: `appNav.mapNavList.${key}`,
        path: matchRoute.path
      }
    })
    return {
      navDataArr
    }
  }
}
</script>
