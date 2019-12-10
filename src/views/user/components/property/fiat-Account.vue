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
    </div>
    <zg-table v-loading="loading" size="small" :column="mapAccoutColumns" border stripe :data="tableList" @change="handlePageChange" />

  </div>
</template>
<script>
import ZgTable from '@/components/zg-table'
import { getlegalTenderBalanceList } from '@/api/property'
import { mapCurrency } from '@/const'
// getPropertyAccountList, getFinanceList, getDepositList, getWithdrawList,
import CountUp from 'countup/dist/countUp.min'
export default {
  name: 'FiatAccount',
  components: {
    ZgTable
  },
  data() {
    return {
      mapCurrency,
      tableList: [],
      loading: true,
      activeCurrency: 'CNY',
      showHistory: false
    }
  },
  computed: {
    mapAccoutColumns() {
      const mapTableColumns = this.langData.mapTableColumns
      return Object.keys(mapTableColumns).map(key => {
        const obj = { prop: key, label: mapTableColumns[key] }
        if (key === 'totalValue') {
          obj.formatter = (row, column, cellValue, index) => {
            const value = row.totalValue[this.activeCurrency]
            return value ? this.bigRound(value, 4) + ' ' + this.activeCurrency : '--'
          }
        }
        return obj
      })
    },
    estimatedTotalValue() {
      return this.tableList.reduce((prev, curr) => {
        return +curr.totalValue[this.activeCurrency] + prev
      }, 0)
    }
  },
  methods: {
    handlePageChange(pageConfig) {
      this._temPageConfig = pageConfig || this._temPageConfig
      if (!pageConfig) this._temPageConfig.init()
      const { pageSize, currentPage } = this._temPageConfig
      this.loading = true
      getlegalTenderBalanceList({ page: currentPage, size: pageSize }).then(res => {
        const arr = res.data.map(item => {
          item.totalValue = mapCurrency.reduce((prev, curr) => {
            prev[curr] = +item.rates[curr] * (+item.available + (+item.ordering))
            return prev
          }, {})
          return item
        })
        this.tableList = arr
        !this.showHistory && this.updateNumber()
        this._temPageConfig.total = res.total
        this.loading = false
      })
    },
    updateNumber() {
      const countObj = new CountUp(this.$refs.numerical, 0, { duration: 4 })
      countObj.update(this.estimatedTotalValue || 0)
    }
  }
}
</script>
