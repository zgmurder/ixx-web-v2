<template>
  <div class="legalTender">
    <div class="container" flex="main:justify">
      <div class="container-left">
        <el-select v-model="selectCurrency" @change="handlePageChange(null)">
          <el-option
            v-for="(value,key) in mapCurrency"
            :key="key"
            :label="key"
            :value="key"
          >
            <span style="float: left">{{ key }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ $tR(`mapCurrency.${key}`) }}</span>
          </el-option>
          <div slot="prefix" class="markness">{{ $tR(`mapCurrency.${selectCurrency}`) }}</div>
        </el-select>
        <div class="menu-container">
          <ul class="digital-container">
            <li>
              <span v-for="(value,key) in mapSidebarMenu.currencyTitle" :key="key">{{ $tR(`mapSidebarMenu.currencyTitle.${key}`) }}</span>
            </li>
            <li v-for="(item,index) in digitalArr" :key="index" :class="{active:digitalActive === item.currency}" @click="handeDigitalActived(item.currency)">
              <span>{{ item.currency }}</span>
              <span>{{ item.cny_rate }}</span>
            </li>
          </ul>
          <ul class="transaction">
            <li v-for="(value,key) in mapSidebarMenu.transaction" :key="key">{{ $tR(`mapSidebarMenu.transaction.${key}`) }}</li>
          </ul>
          <ul class="help">
            <li v-for="(value,key) in mapSidebarMenu.help" :key="key">{{ $tR(`mapSidebarMenu.help.${key}`) }}</li>
          </ul>
        </div>
      </div>
      <div class="container-right">
        <div class="container-top" flex="main:justify cross:center">
          <div>
            <el-link :type="isBuy ? 'primary' : 'info'" style="margin-right:40px" @click="isBuy = true">{{ $tR(`otc_side_1`) }}</el-link>
            <i class="separator" />
            <el-link :type="isBuy ? 'info' : 'primary'" @click="isBuy = false">{{ $tR(`otc_side_2`) }}</el-link>
          </div>
          <div>
            <span>{{ $tR(`otc_legal_currency`) }}</span>：<el-link type="primary" :underline="false">{{ selectCurrency }}（{{ $tR(`mapCurrency.${selectCurrency}`) }}）</el-link>
            <el-button type="primary" @click="drawerVisible = true">{{ $tR(`otc_publish_order`) }}</el-button>
          </div>
        </div>
        <div class="container-center" flex="main:justify cross:center">
          <div>
            <span style="font-size: 18px;color: #1a1a1a;display:inline-block;margin-right:10px">{{ isBuy ? $tR(`yj_mb`):$tR(`yj_mb1`) }}</span>
            <span class="el-link el-link--info cursor-text">{{ $tR(`xe_je`) }}</span>
          </div>
          <div style="flex:1" flex="main:right cross:center">
            <el-input v-model="input3" :placeholder="handlePlaceholder" style="width:400px;margin-right:10px">
              <el-select slot="prepend" v-model="isMethod" style="width:120px">
                <el-option v-for="(value,key) in mapBuyOrSellMethods[isBuy ? 'buy' : 'sell']" :key="key" :label="$tR(`mapBuyOrSellMethods.${isBuy?'buy':'sell'}.${key}`)" :value="key" />
              </el-select>
            </el-input>
            <el-button :type="isBuy ? 'primary' : 'danger'">{{ isBuy ? $tR(`otc_side_1`):$tR(`otc_side_2`) }}{{ digitalActive }}</el-button>
          </div>
        </div>
        <div class="container-bottom">
          <custom-table v-loading="loading" :table-list="tableList" :table-columns="tableColumns" border @change="handlePageChange">
            <div slot="handlerDom"><!--  slot-scope="data" -->
              <el-button size="mini" :type="isBuy ? 'success' : 'danger'">{{ isBuy ? $tR(`otc_side_1`):$tR(`otc_side_2`) }}{{ digitalActive }}</el-button>
            </div>
          </custom-table>
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      :before-close="handleDrawerClose"
    >
      <span slot="title" class="el-button--text" style="font-size:24px;text-algin:left">发布委托单</span>
      <drawerForm />
    </el-drawer>
  </div>
</template>
<script>
// import { getValueByPath } from '@/utils/index'
import { getDigitalCurrencyList, getOtcTradeTableList } from '@/api/legalTender'
import customTable from '@/components/customTable'
import drawerForm from './drawerForm'
export default {
  name: 'LegalTender',
  components: {
    customTable,
    drawerForm
  },
  data(vm) {
    return {
      selectCurrency: 'CNY',
      digitalArr: [],
      digitalActive: '',
      isBuy: true,
      isMethod: '',
      input3: '',
      isPlaceholder: '',

      tableList: [],
      loading: true,

      drawerVisible: false,
      formSchema: []
    }
  },
  computed: {
    mapCurrency() {
      return this.chineseLangData.mapCurrency
    },
    mapSidebarMenu() {
      return this.chineseLangData.mapSidebarMenu
    },
    mapBuyOrSellMethods() {
      return this.chineseLangData.mapBuyOrSellMethods
    },
    mapTableColumns() {
      return this.chineseLangData.mapTableColumns
    },
    tableColumns() {
      return Object.keys(this.mapTableColumns).map(key => ({
        hearderLabel: this.$tR(`mapTableColumns.${key}`),
        prop: key
      }))
    },
    handlePlaceholder() {
      return this.$tR(`${this.isMethod}_p`)
    }
  },

  watch: {
    'isBuy': {
      handler(newValue) {
        const res = this.mapBuyOrSellMethods[this.isBuy ? 'buy' : 'sell']
        this.isMethod = Object.keys(res)[0]
        this.handlePageChange(null)
      },
      immediate: true
    }
  },
  created() {
    // this.timer = setInterval(this.handleDigital, 5000)
    this.handleDigital().then(currency => {
      this.digitalActive = currency
      this.handlePageChange(null)
    })
  },
  destroyed() {
    // clearInterval(this.timer)
  },
  methods: {
    async handleDigital() {
      this.digitalArr = (await getDigitalCurrencyList()).data
      return this.digitalArr[0].currency
    },
    async handlePageChange(pageConfig) {
      this.temPageConfig = pageConfig || this.temPageConfig
      this.loading = true
      if (!this.digitalActive) return
      if (pageConfig === null) this.temPageConfig.init()
      const { currentPage, pageSize } = this.temPageConfig
      const res = await getOtcTradeTableList({
        page: currentPage,
        size: pageSize,
        side: this.isBuy ? 1 : 2,
        currency_type: this.selectCurrency,
        currency: this.digitalActive
      })
      this.temPageConfig.total = res.data.total
      this.tableList = res.data.data
      this.loading = false
    },
    handeDigitalActived(currency) {
      this.digitalActive = currency
      this.handlePageChange(null)
    },
    handleDrawerClose() {
      this.drawerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.legalTender{
  color: $--secondary-text;
  padding-top: 60px;
  padding-bottom: 100px;
  .container-left{
    width: 210px;
    font-size: 13px;
    line-height: 40px;
    .markness{
      position: absolute;
      width: 150px;
      text-align: right;
      line-height: 40px;
      &:hover{
        cursor: default
      }
    }
    .digital-container,.menu-container>.transaction,.menu-container>.help{
      border: $--table-border;
      margin: 20px 0;
      // color: $--secondary-text;
      text-align: center;
      &>li{
        &:not(:last-child){
          border-bottom: $--table-border
        }
        &.active,&:hover:not(:first-child){
          box-shadow: inset 3px 0 0 0 $--color-primary;
          background: $--background-active-bg;
          cursor: default
        }
        &>span{
          flex: 1;
        }
      }
    }
    .digital-container>li{
        display: flex;
        justify-content: space-between;
    }
  }
  .container-right{
    flex: 1;
    margin-left: 50px;
    font-size: 14px;
    .container-top{
      margin-bottom: 30px;
      .separator{
        width: 1px;
        height: 30px;
        background: $--secondary-text;
        position: absolute;
        margin-top:-5px;
        margin-left:-20px
      }
    }
    .container-center{
      padding: 30px 0;
      border-top: 4px solid $--border-color-lighter;
      border-bottom: 4px solid $--border-color-lighter;
      margin-bottom: 30px;
    }
  }
}
</style>
