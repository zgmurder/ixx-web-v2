<template>
  <div class="property-manage-warp" flex="dir:top">
    <slot />
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="划转记录" name="2" />
      <el-tab-pane label="充币记录" name="3" />
      <el-tab-pane label="提币记录" name="4" />
      <el-tab-pane label="奖励分配" name="5" />
      <el-tab-pane label="返佣记录" name="6" />
    </el-tabs>
    <custom-table
      v-loading="loading" stripe
      :show-summary="showSummary" border
      size="small" :filter-change="filterHandler"
      :max-height="calcWidth" :last-column-config="lastColumnConfig"
      :table-list="tableList" :table-columns="mapAccoutColumns"
      @change="handlePageChange"
    >
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
import lbTable from '@/components/lb-table'
import { getPropertyAccountList, getFinanceList, getDepositList, getWithdrawList } from '@/api/property'
export default {
  name: 'PropertyManage',
  components: {
    customTable,
    lbTable
  },
  data() {
    return {
      tableList: [],
      filterObj: [],
      loading: true,
      noData: true,
      showSummary: true,
      pageConfig: {},
      activeCurrency: 'CNY',

      lastColumnConfig: {
        headerLabel: '操作',
        headerAlign: 'right',
        width: '150px'
      },
      activeName: '2'
    }
  },
  computed: {
    mapAccoutColumns() {
      return Object.keys(this.langData[this.activeName]).map(key => {
        const obj = {
          hearderLabel: this.$tR(`${this.activeName}.${key}`),
          prop: key,
          columnKey: key,
          handleValue: value => {
            if (+value && !isNaN(+value)) return this.bigRound(value, 2)
          }
        }
        if (key === 'rates') {
          obj.filters = this.filterObj
          obj.hearderLabel = `${obj.hearderLabel} ${this.activeCurrency}`
          obj['filter-multiple'] = false
          obj['filter-method'] = this.filterHandler
          obj['filtered-value'] = [this.activeCurrency]
          obj.handleValue = config => !+config[this.activeCurrency] ? '--' : this.bigRound(config[this.activeCurrency], 4) + ' ' + this.activeCurrency
        }
        if (key === 'totalValue') {
          obj.handleValue = (obj, column, row) => {
            const value = (+row.available + (+row.locking)) * (+row.rates[this.activeCurrency])
            return value ? this.bigRound(value, 4) + ' ' + this.activeCurrency : '--'
          }
        }
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
        1: getPropertyAccountList,
        2: getFinanceList,
        3: getDepositList,
        4: getWithdrawList
      }
    }
  },
  created() {

  },
  methods: {
    handleTabClick() {
      this.handlePageChange(this.pageConfig)
    },
    filterHandler(value, row, column) {
      this.activeCurrency = column.filteredValue[0]
      return true
    },
    filterChange() {
      console.log(1111)
    },
    handlePageChange(obj) {
      const { pageSize, currentPage } = obj
      this.pageConfig = obj
      this.loading = true
      this.api[this.activeName]({ user_id: this.id, page: currentPage, size: pageSize }).then(res => {
        this.activeName === '1' && (this.filterObj = Object.keys(res.data[0].rates).map(key => ({ text: key, value: key })))
        this.tableList = Array.isArray(res.data) ? res.data : res.data.data
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.property-manage-warp{

}
</style>
