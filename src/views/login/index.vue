<template>
  <div class="login-container">
    <background />
    aaa
  </div>
</template>
<script>
import background from './components/background'
export default {
  components: {
    background
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
.login-container{
  position: absolute;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  top: 0;
  bottom: 0;
  margin-top: 60px;
}

</style>
