<template>
  <div class="app-nav" :style="appNavBackground">
    <div class="container" flex="main:justify cross:center">
      <div flex class="nav-left-container">
        <img src="@/assets/ixx_logo.png" height="40px" alt="" @click="$router.push('/')">
        <ul flex="main:justify cross:center" class="nav-list">
          <li v-for="(item,index) in navDataArr" :key="index" :class="{active:$route.path.includes(item.path)}" @click="$router.push(item.path)">{{ $t(item.keyPath) }}</li>
        </ul>
      </div>
      <div class="nav-right-container">
        <el-link :type="$route.path === '/login'? 'primary':'info'" @click="$router.push('/login')">登录</el-link>
        <i class="separator">|</i>
        <el-link type="info">注册</el-link>
        <select-lang />
      </div>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import selectLang from '@/components/selectLang'
import { mapNavBackground } from '@/const'
export default {
  name: 'Home',
  components: {
    selectLang
  },
  props: {
    navDataArr: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    appNavBackground() {
      const key = Object.keys(mapNavBackground).find(key => this.$route.path.includes(key))
      return key ? { backgroundColor: mapNavBackground[key] } : {}
    }
  }
}
</script>
<style lang="scss" scope>
  .app-nav{
    height: 60px;
    color: #dadada;
    background-color: $--background-color-gray;
    .nav-left-container{
      .nav-list>li{
        margin: 0 10px;
        overflow: hidden;

        &:hover,&.active{
          cursor: pointer;
          color: $--color-primary
        }
      }
    }
    .nav-right-container{
      font-size: 14px;
      .separator{
        display: inline-block;
        padding: 0 12px;
        &:hover{
          cursor: text
        }
      }
    }
  }
</style>
