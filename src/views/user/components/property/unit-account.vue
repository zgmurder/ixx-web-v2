<template>
  <div class="property-manage-warp" flex="dir:top">
    <div v-if="!showHistory" style="padding:20px 0;position:relative">
      <p class="text-info">IXX 总净资产估值：
        <el-radio-group v-model="activeCurrency" @change="updateNumber">
          <el-radio v-for="(value,index) in mapCurrency" :key="index" :label="value">{{ value }}</el-radio>
        </el-radio-group>
      </p>
      <h1 class="numerical text-danger" style="margin-top:8px">≈ <span ref="numerical" /> {{ activeCurrency }}</h1>
      <el-button style="position:absolute;right:0;top:25px" round @click="showHistory = true,handlePageChange(null),$emit('showHistory',showHistory)">历史记录</el-button>
    </div>
    <div v-else>
      <el-page-header content="历史记录" @back="showHistory = false,handlePageChange(null),$emit('showHistory',showHistory)" />
      <hr>
      <el-tabs v-model="activeTab" type="card" @tab-click="handlePageChange(null)">
        <el-tab-pane label="交易记录" name="1" />
        <el-tab-pane label="财务记录" name="2" />
        <el-tab-pane label="盈亏记录" name="3" />
      </el-tabs>
    </div>
    <zg-table v-loading="loading" size="small" :column="mapAccoutColumns" border stripe :data="tableList" @change="handlePageChange" />
  </div>
</template>
<script>
import ZgTable from '@/components/zg-table'
import { getUnitBalanceList, getUnitBalanceHistoryList, getUnitRecordList } from '@/api/property'
import { mapCurrency } from '@/const'
// getPropertyAccountList, getFinanceList, getDepositList, getWithdrawList,
import CountUp from 'countup/dist/countUp.min'
export default {
  name: 'ContractAccount',
  components: {
    ZgTable
  },
  data() {
    return {
      mapCurrency,
      tableList: [],
      loading: true,
      activeCurrency: 'CNY',
      showHistory: false,
      activeTab: '1'
    }
  },
  computed: {
    mapAccoutColumns() {
      const mapTableColumns = !this.showHistory ? this.langData.mapTableColumns : this.columns[this.activeTab]
      return Object.keys(mapTableColumns).map(key => {
        const obj = { prop: key, label: mapTableColumns[key] }
        if (['available'].includes(key)) {
          obj.formatter = row => +row[key] ? `${this.bigRound(row[key], 8)} ${row.currency}` : '--'
          // key !== 'available' && (obj.width = '120')
        }
        return obj
      })
    },
    estimatedTotalValue() {
      return 0
      // return this.tableList.reduce((prev, curr) => {
      //   return +curr.totalValue[this.activeCurrency] + prev
      // }, 0)
    },
    columns() {
      return {
        1: this.allLangData.contract.mapTableTapContents.historyEntrust.mapTableColumns,
        2: this.langData.mapFinanceColumns,
        3: this.langData.mapFinanceColumns
      }
    },
    api() {
      return {
        1: getUnitBalanceHistoryList,
        2: getUnitRecordList
      }
    }
  },
  methods: {
    handlePageChange(pageConfig) {
      this._temPageConfig = pageConfig || this._temPageConfig
      if (!pageConfig) this._temPageConfig.init()
      const { pageSize, currentPage } = this._temPageConfig
      this.loading = true
      const fn = this.showHistory ? this.api[this.activeTab] : getUnitBalanceList
      fn({ page: currentPage, size: pageSize }).then(res => {
        // const arr = res.data.map(item => {
        //   item.totalValue = mapCurrency.reduce((prev, curr) => {
        //     prev[curr] = +item.rates[curr] * (+item.available + (+item.ordering))
        //     return prev
        //   }, {})
        //   return item
        // })
        this.tableList = Array.isArray(res.data) ? res.data : res.data.data
        !this.showHistory && this.updateNumber()
        this._temPageConfig.total = res.data.total
        this.loading = false
      })
    },
    updateNumber() {
      const countObj = new CountUp(this.$refs.numerical, 0, { duration: 4 })
      countObj.update(this.estimatedTotalValue || 0)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.showHistory) return
      if (columnIndex === 1) return !rowIndex ? [3, 1] : [0, 0]
    }
  }
}
</script>
