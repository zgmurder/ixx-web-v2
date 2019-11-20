<template>
  <div class="property-manage-warp" flex="dir:top">
    <slot />
    <div style="position: relative;">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="(value,key) in mapTab" :key="key" :name="key" :label="$tR(`mapTab.${key}`)" />
      </el-tabs>
      <div style="position:absolute;right:0;top:15px">
        <el-link v-if="showHistory" @click="showHistory = false">返回</el-link>
        <el-link v-else type="warning" @click="hanldeHistoryBtn">完整历史记录</el-link>
      </div>
    </div>
    <custom-form v-if="showHistory" :schema="schema" :inline="true" />
    <custom-table
      v-loading="loading" stripe
      :show-summary="true" border
      size="small" :filter-change="filterHandler"
      :max-height="calcWidth" :last-column-config="lastColumnConfig"
      :table-list="tableList" :table-columns="tableColumns"
      @change="handlePageChange"
    >
      <!-- slot-scope="data" -->
      <div slot="handlerDom">
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
import customForm from '@/components/customForm'
import {
  getlegalTenderBalanceList,
  getFutureBalanceList,
  getCoinsBalanceList,
  getShareBalanceList,
  getOtcHistory,
  getFutureHistory,
  getCoinsHistory,
  getShareHistory,
  getFinanceList } from '@/api/property'
export default {
  name: 'DealAccount',
  components: {
    customTable,
    customForm
  },
  data() {
    return {
      tableList: [],
      filterObj: [],
      loading: true,
      pageConfig: {},
      activeCurrency: 'CNY',

      lastColumnConfig: {
        headerLabel: '操作',
        headerAlign: 'right',
        width: '150px'
      },
      activeName: '1',

      showHistory: false,

      schema: [
        { fieldType: 'input', size: 'mini', placeholder: '人员姓名', vModel: 'name', required: true, name: '小王' },
        { fieldType: 'input', size: 'mini', placeholder: '人员姓名', vModel: 'name', required: true, name: '小王' },
        { fieldType: 'input', size: 'mini', placeholder: '人员姓名', vModel: 'name', required: true, name: '小王' },
        { fieldType: 'input', size: 'mini', placeholder: '人员姓名', vModel: 'name', required: true, name: '小王' }
      ]
    }
  },
  computed: {
    mapTableColumns() {
      console.log(this.showHistory)

      return this.langData[this.showHistory ? 'mapHistoryTableColumns' : 'mapTableColumns']
    },
    mapTab() {
      return this.langData.mapTab
    },
    tableColumns() {
      return Object.keys(this.mapTableColumns[this.activeName]).map(key => {
        const obj = {
          hearderLabel: this.$tR(`${this.showHistory ? 'mapHistoryTableColumns' : 'mapTableColumns'}.${this.activeName}.${key}`),
          prop: key,
          columnKey: key
          // handleValue: obj => obj[this.activeCurrency]
        }
        // if (key === 'rates') {
        //   obj.filters = this.filterObj
        //   obj.hearderLabel = `${obj.hearderLabel} ${this.activeCurrency}`
        //   obj['filter-multiple'] = false
        //   obj['filter-method'] = this.filterHandler
        //   obj['filtered-value'] = [this.activeCurrency]
        //   // obj.handleValue = config => config[this.activeCurrency] + this.activeCurrency
        // }
        // if (key === 'totalValue') {
        //   obj.handleValue = (obj, column, row) => {
        //     const value = (+row.available + (+row.locking)) * (+row.rates[this.activeCurrency])
        //     return value ? value + ' ' + this.activeCurrency : '--'
        //   }
        // }
        return obj
      })
    },
    mapTableInfo() {
      return this.langData.mapTableInfo
    },
    userData() {
      return this.$store.state.userData
    },
    calcWidth() {
      return document.body.clientHeight - 200
    },
    api() {
      return {
        1: this.showHistory ? getOtcHistory : getlegalTenderBalanceList,
        2: this.showHistory ? getFutureHistory : getFutureBalanceList,
        3: getCoinsBalanceList,
        4: getShareBalanceList
      }
    }
  },
  created() {

  },
  methods: {
    handleTabClick() {
      this.handlePageChange()
    },
    filterHandler(value, row, column) {
      this.activeCurrency = column.filteredValue[0]
      return true
    },
    filterChange() {
      console.log(1111)
    },
    handlePageChange(pageConfig) {
      this.temPageConfig = pageConfig || this.temPageConfig
      if (!pageConfig) this.temPageConfig.init()
      const { pageSize, currentPage } = this.temPageConfig
      this.loading = true
      this.api[this.activeName]({ user_id: this.id, page: currentPage, size: pageSize }).then(res => {
        // this.filterObj = Object.keys(res.data[0].rates).map(key => ({ text: key, value: key }))
        this.tableList = Array.isArray(res.data) ? res.data : res.data.data
        !Array.isArray(res.data) && (this.temPageConfig.total = res.data.total)
        this.loading = false
      })
    },
    hanldeHistoryBtn() {
      this.showHistory = true
      this.handlePageChange()
    }
  }
}
</script>
<style lang="scss" scoped>
.property-manage-warp{

}
</style>
