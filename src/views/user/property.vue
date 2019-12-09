<template>
  <div class="user-center">
    <div class="user-center-container" flex="main:justify box:mean">
      <div class="container-left">
        <navMenu v-model="activeKey" :map-menu-list="mapMenuList" @change="handleClick" />
      </div>
      <div class="container-right">
        <div v-if="!showHistory">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-if="activeKey !== '1.property-manage'" :to="{ path: '/user/property' }">{{ $tR(`mapMenuList1.1.children.property-manage`) }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <hr>
        </div>
        <component :is="componentId" @showHistory="value =>showHistory = value " />
      </div>
    </div>
  </div>
</template>
<script>
import customTable from '@/components/customTable'
import navMenu from '@/components/nav-menu'
import { mapCurrency } from '@/const'
export default {
  name: 'Property',
  components: {
    customTable,
    navMenu
  },
  data() {
    return {
      tableList: [],
      loading: false,
      componentId: null,
      activeKey: '',
      selectCurrency: 'CNY',
      mapCurrency,
      showHistory: false
    }
  },
  computed: {
    mapMenuList() {
      return this.langData.mapMenuList1
    },
    title() {
      const pathArr = this.activeKey.replace('.', '.children.').split('.')
      return pathArr.reduce((prev, curr) => {
        return prev[curr]
      }, this.mapMenuList)
    }
  },
  watch: {
    '$route.query': {
      handler({ key }) {
        this.showHistory = false
        this.activeKey = key || '1.property-manage'
        const name = this.activeKey.split('.')[1]
        this.componentId = () => import(`./components/property/${name}`)
      },
      immediate: true
    }
  },
  methods: {
    handleClick(key) {
      this.$router.push({ path: this.$route.path, query: { key }})
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-center{
    // padding-top: 60px;
    font-size: 14px;
    background: #fafafa;
    height: calc(100vh - 60px);
    box-sizing: border-box;
    overflow: hidden;
    .user-center-container{
      height: 100%;
      &>.container-left{
        flex: none;
        width: 200px;
        margin-right: 40px;
      }
      &>.container-right{
        background: #fff;
        padding: 20px;
        .container-title{
          line-height: 50px;
          // border-bottom: 1px solid #ddd;
          // margin-bottom: 12px;
          font-size: 18px;
          font-weight: bold
        }
      }
    }
  }
</style>
