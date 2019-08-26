<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    const that = this
    window.TradingView.onready(function(configurationData) {
      that.$eventBus.$on('TradingViewOnready', callBack => {
        callBack()
      })
    })
  }
}
</script>
