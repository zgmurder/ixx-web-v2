<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
    <transition name="el-zoom-in-center">
      <div v-if="$root.modelVisible" class="model" @click="$root.modelVisible = false" />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App'
  // created() {
  //   const that = this
  //   window.TradingView.onready(function(configurationData) {
  //     that.$eventBus.$on('TradingViewOnready', callBack => {
  //       typeof callBack === 'function' && callBack()
  //     })
  //   })
  // }
}
</script>
<style lang="scss" scoped>
.model{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba($color: #000000, $alpha: 0.8);
  z-index: 10;
}

</style>
