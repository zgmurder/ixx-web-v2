<template>
  <div class="user-center">
    <div class="container user-center-container" flex="main:justify box:mean">
      <div class="container-left">
        <ul class="menu-list">
          <li v-for="(value,key) in mapMenuList" :key="key" :class="{active:activeKey === key}" @click="handleClick(key)">{{ $tR(`mapMenuList.${key}`) }}</li>
        </ul>
      </div>
      <div class="container-right">
        <keep-alive>
          <component :is="componentId"><h3 flex="main:justify cross:center">{{ $tR(`mapMenuList.${activeKey}`) }}<el-button size="mini" type="primary">资产管理<i class="el-icon-arrow-right" /></el-button></h3></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import customTable from '@/components/customTable'

export default {
  name: 'UserCenter',
  components: {
    customTable
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
      return this.chineseLangData.mapMenuList
    }
  },
  created() {
    this.handleClick('person-info')
  },
  methods: {
    handleClick(key) {
      this.componentId = () => import(`./components/${key}`)
      this.activeKey = key
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
        &>.menu-list{
          // border: 1px solid $border-color-lighter;
          background: #fff;
          &>li{
            line-height: 40px;
            height: 40px;
            border: 1px solid $border-color-lighter;
            text-align: center;
            color: #999;
            cursor: pointer;
            &:not(:first-child){
              border-top: none;
            }
            &:hover{
              color: #333;
              background: #fafafa
            }
            &.active{
              box-shadow: inset 3px 0 0 0 $--color-primary;
              background: $--background-active-bg;
            }
          }
        }
      }
      &>.container-right{
        background: #fff;
        padding: 20px;
      }
    }
  }
</style>
