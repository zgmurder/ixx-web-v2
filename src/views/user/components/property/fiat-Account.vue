<template>
  <div class="property-manage-warp" flex="dir:top">
    <div style="padding:20px 0;">
      <p class="text-info">IXX 总净资产估值：
        <el-radio-group v-model="activeCurrency">
          <el-radio label="CNY">CNY</el-radio>
          <el-radio label="USD">USD</el-radio>
        </el-radio-group>
      </p>
      <h1 class="numerical text-danger" style="margin-top:8px">≈ <span id="numerical" /> {{ activeCurrency }}</h1>
    </div>
    <zg-table :data="tableList" columns />
    <zg-table v-loading="loading" size="small" :column="mapAccoutColumns" border stripe :data="tableList" @change="handlePageChange" />
    <!-- <custom-table
      v-loading="loading" stripe
      border
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
    </custom-table> -->
  </div>
</template>
<script>
import ZgTable from '@/components/zg-table'
import { getPropertyAccountList, getFinanceList, getDepositList, getWithdrawList, getlegalTenderBalanceList } from '@/api/property'
import CountUp from 'countup/dist/countUp.min'
export default {
  name: 'PropertyManage',
  components: {
    ZgTable
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
      activeName: '1'
    }
  },
  computed: {
    mapAccoutColumns() {
      const langData = this.langData[this.activeName]
      return Object.keys(langData).map(key => {
        const obj = {
          prop: key,
          label: langData[key]
          // hearderLabel: this.$tR(`${this.activeName}.${key}`),
          // prop: key,
          // columnKey: key,
          // handleValue: value => {
          //   if (+value && !isNaN(+value)) return this.bigRound(value, 2)
          // }
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
  mounted() {
    const demo = new CountUp(document.querySelector('#numerical'), 0, {
      duration: 4
    })
    if (!demo.error) {
      demo.update(111111111)
    } else {
      console.error(demo.error)
    }
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
    handlePageChange(pageConfig) {
      this._temPageConfig = pageConfig || this._temPageConfig
      if (!pageConfig) this._temPageConfig.init()
      const { pageSize, currentPage } = this._temPageConfig
      this.loading = true
      getlegalTenderBalanceList({ page: currentPage, size: pageSize }).then(res => {
        this.tableList = res.data
        this._temPageConfig.total = res.total
        this.loading = false
      })
      // const { pageSize, currentPage } = obj
      // this.pageConfig = obj
      // this.loading = true
      // this.api[this.activeName]({ user_id: this.id, page: currentPage, size: pageSize }).then(res => {
      //   this.activeName === '1' && (this.filterObj = Object.keys(res.data[0].rates).map(key => ({ text: key, value: key })))
      //   this.tableList = Array.isArray(res.data) ? res.data : res.data.data
      //   this.loading = false
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.property-manage-warp{
}
</style>
