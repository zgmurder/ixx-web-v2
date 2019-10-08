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
        <dropdown style="margin-left:20px" :menu-options="mapUserCenter"><div :class="{active:$route.path.includes('/user/')}" @click="$router.push('/user/index')">{{ $store.state.userData.email }} <i class="el-icon-caret-bottom" /></div></dropdown>
        <dropdown v-if="$route.path === '/share_option/index' && mapBalanceMenu.length" v-model="activeShareAccount" style="margin-left:20px" :menu-min-width="250" :menu-options="mapBalanceMenu">
          <div>
            {{ activeShareAccount.label }} <i class="el-icon-caret-bottom" />
          </div>
          <!-- <div></div> -->
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
import { removeUser } from '@/utils/auth'
import { loginout } from '@/api/user'
import { bigRound } from '@/utils/handleNum'
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
      activeIndex2: '1',
      activeShareAccount: null
    }
  },
  computed: {
    appNavBackground() {
      const key = Object.keys(mapNavBackground).find(key => this.$route.path.includes(key))
      return key ? { backgroundColor: mapNavBackground[key] } : {}
    },
    mapBalanceMenu() {
      const mapIcon = ['btc', 'BTS', 'eth']
      const arr = this.$store.state.mapShareAccount.map((item, index) => ({
        index,
        icon: mapIcon[index],
        label: `${item.currency}账户 / ${bigRound(item.available, 4)}`,
        describe: {
          label: '充值',
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          click: item => this.$router.push({ path: 'aaa', params: item })
        },
        ...item
      }))
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (this.activeShareAccount) { this.activeShareAccount = arr[this.activeShareAccount.index] }
      return arr
    },
    mapUserCenter() {
      return [
        { label: '个人中心', path: '/user/index' },
        { label: '资产管理', path: '/user/property' },
        { label: '退出', click: () => loginout().then(res => {
          location.reload()
          removeUser()
          this.$store.commit('SET_USERDATA', null)
        }) }
      ]
    }
  },
  watch: {
    activeShareAccount: {
      handler(newValue) {
        if (newValue) {
          localStorage.setItem('activeShareAccount', JSON.stringify(newValue))
          this.$store.commit('SET_ACTIVESHAREACCOUNT', newValue)
        }
      }
    }
  },
  created() {
    const tem = localStorage.getItem('activeShareAccount')
    console.log(this.mapBalanceMenu)

    this.activeShareAccount = tem ? JSON.parse(tem) : this.mapBalanceMenu[0]
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
