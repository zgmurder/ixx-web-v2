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
        <!-- <dropdown style="margin-left:20px" :menu-options="mapBalanceMenu"><div :class="{active:$route.path.includes('property')}" @click="$router.push('/user/property')">资产管理 <i class="el-icon-caret-bottom" /></div></dropdown> -->
        <dropdown style="margin-left:20px" :menu-options="mapUserCenter" label="label"><div :class="{active:$route.path.includes('/user/')}" @click="$router.push('/user/index')">{{ $store.state.userData.email||$store.state.userData.phone }} <i class="el-icon-caret-bottom" /></div></dropdown>
        <dropdown v-if="$route.path === '/share_option/index' && mapBalanceMenu.length" v-model="activeShareAccount" label="currency" :handle-label="item=>`${item.currency} 账户 / ${item.available}`" style="margin-left:20px" :menu-min-width="250" :menu-options="mapBalanceMenu">
          <svg-icon slot="item-prefix" slot-scope="{data}" :icon-class="data.currency.toLowerCase()" />
          <el-link slot="item-suffix" type="primary" :underline="false">充值</el-link>
          <div v-if="activeShareAccount">{{ activeShareAccount.currency }} 账户 / {{ activeShareAccount.available }} <i class="el-icon-caret-bottom" /></div>
        </dropdown>
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
// import { removeUser } from '@/utils/auth'
// import { loginout } from '@/api/user'
// import { bigRound } from '@/utils/handleNum'
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
    },
    mapBalanceMenu() {
      return this.$store.state.mapShareAccount
    },
    mapUserCenter() {
      return [
        { label: '个人中心', path: '/user/index' },
        { label: '资产管理', path: '/user/property' },
        { label: '退出', click: () => this.$store.dispatch('loginout') }
      ]
    },
    activeShareAccount: {
      get() {
        return this.$store.state.activeShareAccount
      },
      set(value) {
        this.$store.commit('SET_ACTIVESHAREACCOUNT', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
      .active{
        cursor: pointer;
        color: $--color-primary;
      }
    }
  }
</style>
