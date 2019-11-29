<template>
  <div class="layout">
    <app-nav />
    <keep-alive :include="['contract']">
      <router-view />
    </keep-alive>
    <app-footer v-if="showFooter" />
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
  computed: {
    showFooter() {
      return ['/home'].includes(this.$route.path)
    }
  }
}
</script>
