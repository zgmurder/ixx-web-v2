<template>
  <div class="property-manage-warp" flex="dir:top">
    <div class="top">
      <slot />
      <el-divider />
    </div>
    <custom-table v-loading="false" :last-column-config="lastColumnConfig" :table-list="tableList" :table-columns="mapAccoutColumns">
      <!-- slot-scope="data" -->
      <div slot="handlerDom" style="width:200px">
        <el-link type="primary">划转</el-link>
        <el-link type="primary">充币</el-link>
        <el-link type="primary">提币</el-link>
        <el-link type="primary">交易</el-link>
      </div>
    </custom-table>
  </div>
</template>
<script>
import customTable from '@/components/customTable'
import { getPropertyAccountList } from '@/api/property'
export default {
  name: 'PropertyManage',
  components: {
    customTable
  },
  data() {
    return {
      tableList: [],
      loading: false,
      lastColumnConfig: {
        headerLabel: '操作',
        headerAlign: 'right',
        width: '400px'
      }
    }
  },
  computed: {
    mapAccoutColumns() {
      return Object.keys(this.chineseLangData.mapAccoutColumns).map(key => ({
        hearderLabel: this.$tR(`mapAccoutColumns.${key}`),
        prop: key,
        handleValue: obj => obj['CNY']
      }))
    },
    mapTableInfo() {
      return this.chineseLangData.mapTableInfo
    },
    userData() {
      return this.$store.state.userData
    }
  },
  created() {
    getPropertyAccountList().then(res => (this.tableList = res.data))
  }
}
</script>
<style lang="scss" scoped>
.property-manage-warp{
  height: 100%;
  text-align: center;
  &>.center{
    .numerical{
      // line-height: 100px;
      margin-top: 30px;
      color: $--color-danger;
      // border-width: 0 5px 5px 5px;
      // border-style: solid;
      // border-color: rgba($color: $--color-primary, $alpha: .3);
      // padding-bottom: 20px;
    }
  }
  &>.bottom{
    &>fieldset{
      margin: 0;
      padding: 30px;
      box-sizing: border-box;
      width: 48%;
      border: solid 1px #f0f0f0;
      .title{
        font-size: 20px;
      }
      .numerical{
        margin-top:30px;
        margin-bottom: 30px;
        color: rgba($color: $--color-warning, $alpha: 3);
        border-width: 0 5px 5px 5px;
        border-style: solid;
        border-color: #f6f6f6;
        padding-bottom: 20px;
      }
      .list > p{
        line-height: 40px;
      }
    }
  }
}
</style>
