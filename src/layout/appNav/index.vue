<template>
  <div class="app-nav" :style="appNavBackground" flex="main:justify cross:center">
    <div flex class="nav-left-container">
      <img src="@/assets/ixx_logo.png" height="40px" alt="" @click="$router.push('/')">
      <ul flex="main:justify cross:center" class="nav-list">
        <li v-for="(item,index) in navDataArr" :key="index" class="text-nowrap" :class="{active:$route.path.includes(item.path)}" @click="$router.push(item.path)">{{ $t(item.keyPath) }}</li>
      </ul>
    </div>
    <div class="nav-right-container" flex="cross:center">
      <template v-if="$store.state.userData">
        <el-link>我的资产</el-link>
        <dropdown :menu-options="[{href:'aa',label:'bbb'}]">个人中心</dropdown>

      </template>
      <template v-else>
        <el-link :type="$route.path === '/user/login'? 'primary':'info'" @click="$router.push('/user/login')">{{ $tR('signin') }}</el-link>
        <el-divider direction="vertical" />
        <el-link :type="$route.path === '/user/register'? 'primary':'info'" @click="$router.push('/user/register')">{{ $tR('signup') }}</el-link>
      </template>
      <select-lang />
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import selectLang from '@/components/selectLang'
import { mapNavBackground } from '@/const'
import dropdown from '@/components/dropdown'
export default {
  name: 'AppNav',
  components: {
    selectLang,
    dropdown
  },
  props: {
    navDataArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeIndex2: '1'
    }
  },
  computed: {
    appNavBackground() {
      const key = Object.keys(mapNavBackground).find(key => this.$route.path.includes(key))
      return key ? { backgroundColor: mapNavBackground[key] } : {}
    }
  },
  created() {
    console.log(this.$store)
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
        margin: 0 12px;
        overflow: hidden;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        transition: all .5s ease-in-out;
        &:hover,&.active{
          cursor: pointer;
          color: $--color-primary;
          // box-shadow: 0 2px 0 $--color-primary
        }
      }
    }
    .nav-right-container{
      font-size: 14px;
      margin-right: 20px;
      height: 100%;
    }
  }
</style>
