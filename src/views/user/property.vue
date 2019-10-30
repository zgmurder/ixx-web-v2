<template>
  <div class="user-center">
    <div class="container user-center-container" flex="main:justify box:mean">
      <div class="container-left">
        <navMenu v-model="activeKey" :map-menu-list="mapMenuList" @change="handleClick" />
      </div>
      <div class="container-right">
        <keep-alive>
          <component :is="componentId"><h3 flex="main:justify cross:center">{{ $tR(`mapMenuList.${activeKey}`) }}<el-button size="mini" type="primary" @click="$router.push('/user/property')">个人中心<i class="el-icon-arrow-right" /></el-button></h3></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import customTable from '@/components/customTable'
import navMenu from '@/components/nav-menu'
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
      activeKey: ''
    }
  },
  computed: {
    tableColumns() {
      return Object.keys(this.chineseLangData.mapHistoryColumns).map(key => ({
        hearderLabel: this.$tR(`mapHistoryColumns.${key}`),
        prop: key
      }))
    },
    mapMenuList() {
      return Object.keys(this.chineseLangData.mapMenuList).map(key => ({
        label: this.$tR(`mapMenuList.${key}`),
        key
      }))
    }
  },
  watch: {
    '$route.query': {
      handler({ key }) {
        if (!key) return
        this.componentId = () => import(`./components/property/${key}`)
        this.activeKey = key
      },
      immediate: true
    }
  },
  methods: {
    handleClick(key) {
      this.$router.push({ path: this.$route.path, query: { key: key || 'property-manage' }})
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-center{
    padding-top: 60px;
    font-size: 14px;
    background: #fafafa;
    height: calc(100vh - 60px);
    box-sizing: border-box;
    overflow: hidden;
    .user-center-container{
      height: 100%;
      &>.container-left{
        flex: none;
        width: 210px;
        margin-right: 40px;
      }
      &>.container-right{
        background: #fff;
        padding: 20px;
      }
    }
  }
</style>
