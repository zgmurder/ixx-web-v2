<template>
  <table class="table-container" border="1" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td colspan="3">
          <div v-loading="!tickersData" element-loading-background="rgba(0, 0, 0, 0.3)" style="height:100%">
            <div v-if="tickersData" flex="main:left cross:strech" class="tabs-group">
              <div v-for="(product,index) in products" :key="index" :class="{active:activeTabkey === product.name}" flex="dir:top main:center" @click="handleTabClick(product.name)">
                <p>{{ $tR(`mapTabs.${product.name}`) }}</p>
                <span :class="[matchFutureItemByKey(product.name).increment_24h > 0?'text-success':'text-danger']">{{ calcIncreaseRate(matchFutureItemByKey(product.name)) }}%
                  <svg-icon :icon-class="matchFutureItemByKey(product.name).increment_24h > 0?'lv':'hong'" />
                </span>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div v-loading="!delegateData" class="delegate-list" element-loading-background="rgba(0, 0, 0, 0.3)" style="height:100%">
            <div class="header" flex="main:justify">
              <span> {{ $tR(`mapDelegateList.entrust-list`) }}</span>
              <selectBase v-model="dataDeep" :handle-label="value=>`${$tR(`mapDelegateList.depth`)}${value}`" :map-data="['1','0.1']" />
            </div>
            <div class="content-header" flex="main:justify">
              <span v-for="(value,key) in mapHeader1" :key="key">{{ $tR(`mapDelegateList.mapHeader1.${key}`) }}</span>
            </div>
            <div ref="content-wrap" class="content-wrap">
              <div v-if="delegateData" class="content-container">
                <ul>
                  <li v-for="(item,index) in asks.arr" :key="index" flex="main:justify cross:center">
                    <span class="text-danger">{{ item.values[0] | bigRound(activeTabItem.dictionary.price_scale) }}</span>
                    <span style="flex:1">{{ item.values[1] | bigRound(0) }}</span>
                    <span>{{ item.values[2] }}</span>
                    <div class="mark-bg is-buy" :style="{width:handleWidthBg(item.values[1],asks.max)}" />
                  </li>
                </ul>
                <div class="content-center">
                  <p :class="[activeTabItem.increment_24h > 0?'text-success':'text-danger',triggerBtn && 'justify'||'']">
                    <span>
                      {{ activeTabItem.current | bigRound(activeTabItem.dictionary.price_scale) }}
                      <svg-icon :icon-class="activeTabItem.increment_24h > 0?'up':'down'" />
                    </span>
                    <el-link v-if="triggerBtn" :underline="false" type="info" @click="dataLoaded(true)">{{ $tR(`mapDelegateList.return-dish`) }}</el-link>
                  </p>
                  <p v-show="!triggerBtn">{{ activeIndexItem.current }} / {{ handleDishInfoItem('markPrice') }}</p>
                </div>
                <ul>
                  <li v-for="(item,index) in bids.arr" :key="index" flex="main:justify cross:center">
                    <span class="text-success">{{ item.values[0] | bigRound(activeTabItem.dictionary.price_scale) }}</span>
                    <span style="flex:1">{{ item.values[1] | bigRound(0) }}</span>
                    <span>{{ item.values[2] }}</span>
                    <div class="mark-bg is-sell" :style="{width:handleWidthBg(item.values[1],bids.max)}" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div v-loading="!newBargainListData.length" class="delegate-list" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex="main:justify">
              <span> {{ $tR(`mapDelegateList.new-bargain`) }}</span>
            </div>
            <div class="content-header" flex="main:justify box:mean">
              <span v-for="(value,key) in mapHeader2" :key="key">{{ $tR(`mapDelegateList.mapHeader2.${key}`) }}</span>
            </div>
            <div class="content-wrap">
              <div class="content-container">
                <ul>
                  <li v-for="(item,index) in newBargainListData" :key="index" flex="main:justify cross:center box:mean">
                    <span :class="[item.side === 'buy'?'text-success':'text-danger']">{{ $tR(item.side) }}</span>
                    <span :class="[item.side === 'buy'?'text-success':'text-danger']">{{ item.values[0]|bigRound(activeTabItem.dictionary.price_scale) }}</span>
                    <span>{{ item.values[1] }}</span>
                    <span>{{ item.time | parseTime('{h}:{i}:{s}') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div class="form-content">
            <div class="header" flex="main:justify">
              <span> {{ $tR(`mapFormContent.submitEntrust`) }}</span>
            </div>
            <div v-loading="!activeTabItem.dictionary" element-loading-background="rgba(0, 0, 0, 0.3)" class="content-container-submit">
              <div flex="main:justify">
                <div v-for="(value,key) in mapFormContent.mapBtns" :key="key" :class="{active:activeBtnsKey === key}">
                  <dropdown v-if="key === '3'" v-model="activePriceType" :menu-options="menuOptions" label="label">
                    <el-button class="custom-btn" :class="{active:activeBtnsKey === key}" size="small" plain @click="handleSwitch(key)">
                      {{ activePriceType.label }} <i class="el-icon-caret-bottom" />
                    </el-button>
                  </dropdown>
                  <el-tooltip v-else :content="$tR(`mapFormContent.mapBtns.${key}.describe`)" placement="top" effect="dark">
                    <el-button class="custom-btn" :class="{active:activeBtnsKey === key}" size="small" plain @click="handleSwitch(key)">
                      {{ $tR(`mapFormContent.mapBtns.${key}.text`) }}
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div v-for="(value,key,i) in mapFormContent.mapInput" :key="key" flex="main:justify">
                <label for="">{{ $tR(`mapFormContent.mapInput.${key}`) }}</label>
                <div v-if="i===1 && activeBtnsKey === '2'" class="transactionPrice" flex="main:justify box:mean">
                  <div>买：9540</div>
                  <div style="border-left: 1px solid #333;">卖：9540</div>
                </div>
                <template v-else>
                  <input :value="!i ? activeAcountAndPriceArr[i]:(activeAcountAndPriceArr[i]||activeTabItem.current)" type="text" @input="e=>activeAcountAndPriceArr[i] = e.target.value.replace(/^(0+)|[^\d]+/g,'')">
                  <span>USD</span>
                </template>
              </div>
              <div>
                <div v-for="(value,key) in mapFormContent.mapHandleBtn" :key="key">
                  <el-button :type="key === 'buy'?'success':'danger'" :loading="buyBtnLoading" :disabled="!activeAcountAndPriceArr[0]" style="width:100%" @click="submitOrder(key === 'buy'?1:2)">
                    <div v-show="!buyBtnLoading" flex="main:justify cross:center">
                      <span>{{ $tR(`mapFormContent.mapHandleBtn.${key}`) }}</span>
                      <span style="font-size:12px">{{ activeAcountAndPriceArr[0] }} @ {{ activeAcountAndPriceArr[1]||activeTabItem.current }} USD</span>
                    </div>
                  </el-button>
                  <p v-if="key === 'buy'" style="font-size:12px;color:#999">{{ $tR(`mapFormContent.cost`) }}：<span>{{ !activeAcountAndPriceArr[0]?'--':buyCost }}</span>BTC</p>
                  <p v-else style="font-size:12px;color:#999">{{ $tR(`mapFormContent.cost`) }}：<span>{{ !activeAcountAndPriceArr[0]?'--':sellCost }}</span>BTC</p>
                </div>
              </div>
              <div>
                <el-divider><svg-icon icon-class="share-down" /></el-divider>
                <div v-for="(value,key) in mapFormContent.mapDescribe" :key="key" style="font-size:12px" flex="main:justify">
                  <span>{{ $tR(`mapFormContent.mapDescribe.${key}`) }}</span>
                  <span>0 BTC</span>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="1">
          <div v-loading="!tickersData" class="dish-info" element-loading-background="rgba(0, 0, 0, 0.3)">
            <template v-if="tickersData">
              <div class="info-left">
                <div class="title">
                  <svg-icon icon-class="star" class="round" />
                  {{ $tR(`mapTabs.${activeTabkey}`) }}
                  <svg-icon :class="[activeTabItem.increment_24h > 0?'text-success':'text-danger']" :icon-class="activeTabItem.increment_24h > 0?'lv':'hong'" />
                </div>
                <span>资金费率： </span>
                <span>  0.0082 %
                  <el-tooltip content="Global Size" effect="dark" placement="bottom">
                    <i class="el-icon-caret-bottom" />
                  </el-tooltip>
                </span>
              </div>
              <div class="info-list-box">
                <div v-for="(value,key) in mapDishInfo" :key="key">
                  {{ $tR(`mapDishInfo.${key}`) }}：
                  <span :class="[matchClassByKey(key)]">{{ handleDishInfoItem(key) }}{{ key === 'change_24h' && '%' ||'' }}</span>
                </div>
                <div>≈ {{ activeTotalToBTC }} BTC</div>
              </div>
            </template>

            <div class="calculator"><i class="el-icon-caret-bottom" />计算器</div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="8">
          <candlestick :products="products" />
        </td>
      </tr><tr /><tr /><tr /><tr />
      <tr>
        <td rowspan="3" colspan="2">
          <div class="delegate-list">
            <div class="header" flex="main:justify">
              <span> 深度图</span>
            </div>
            <depthMap v-loading="!delegateData" :data="delegateData" element-loading-background="rgba(0, 0, 0, 0.3)" />
          </div>
        </td>
        <td rowspan="3">
          <div v-loading="!activeTabItem.dictionary" class="hold-content" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex="main:justify">
              <span> 持有仓位：{{ activeTabkey && $tR(`mapTabs.${activeTabkey}`)||'' }}</span>
            </div>
            <div class="content-container-hold">
              <div flex="box:mean" style="text-align:center">
                <p>233 <br> 合约交易</p>
                <p>233 <br> 合约交易</p>
              </div>
              <div class="linear-bar" flex="main:justify cross:center">
                <svg-icon icon-class="btc" />
                <svg-icon icon-class="bug" />
                <div class="mark">{{ activeLever }} x</div>
              </div>
              <div class="multiple-bar">
                <div> 杠杆倍数：<el-link type="primary" :underline="false" style="font-size:12px">设置</el-link></div>
                <div>
                  <el-tag v-for="tag in mapLever" :key="tag" style="cursor: pointer;" size="mini" :effect="activeLever === tag && 'dark'||'plain'" @click="activeLever = tag"> {{ tag === '0'?'全仓':tag+'x' }} </el-tag>
                  <!-- <div v-for="value in mapLever" :key="value+'a'" flex="dir:top cross:center" class="leverItem" :class="{'active':activeLever === value,'text-active':activeLever === value}" @click="activeLever = value">
                    <span />
                    <p v-if="value !== '0'">{{ value }}</p>
                    <p v-else>全仓</p>
                  </div> -->
                </div>
                <!-- <div class="dot-wrap" flex="main:justify box:mean">
                  <span v-for="value in mapLever" :key="value+'a'" :class="{'active':activeLever === value,'text-active':activeLever === value}" @click="activeLever = value">•</span>
                  <span>•</span>
                </div>
                <hr>
                <div flex="main:justify box:mean">
                  <span v-for="value in mapLever" :key="value+'b'" :class="{'text-active':activeLever === value}">{{ !+value?'全仓':value }}</span>
                  <span style="line-height:normal;margin-top:3px;">设置</span>
                </div> -->
              </div>
              <p flex="main:justify">
                <span>风险限额</span>
                <span>0.02562016/200BTC\</span>
              </p>
            </div>
          </div>
        </td>
      </tr><tr /><tr />
      <tr>
        <td rowspan="3" colspan="5">
          <div v-loading="!tableList" class="order-list" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex>
              <div v-for="(value,key) in mapTableTapContents" :key="key" :class="{active:activeTableTabKey === key}" @click="handleTableTabClick(key,amountObj[key][1]=false)">
                <el-badge v-if="amountObj" is-dot :hidden="activeTableTabKey === key ||!amountObj[key][1]">
                  <p style="min-width:120px">{{ $tR(`mapTableTapContents.${key}.text`) }}【{{ amountObj[key][0] }}】</p>
                </el-badge>
              </div>
            </div>
            <div class="order-list-content">
              <shipping v-if="activeTableTabKey && activeTableTabKey === 'shipping' && tickersData" :mark-data="markData" :data="tableList" :table-columns="tableColumns" />
              <customTable v-if="activeTableTabKey && activeTableTabKey !== 'shipping' && tableList" header-row-class-name="contract-order-list-row-class" row-class-name="contract-order-list-row-class" size="mini" :table-list="tableList" :last-column-config="lastColumnConfig" :table-columns="tableColumns">
                <div slot="handlerDom"><!--  slot-scope="data" -->
                  <el-button size="mini" type="danger">撤销</el-button>
                </div>
              </customTable>
            </div>
          </div></td>
        <td rowspan="3">
          <div v-loading="!delegateData" class="information" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex="main:justify">
              <span> 深度图</span>
            </div>
            <div v-if="delegateData" class="information-content">
              <div class="content-center">
                <p :class="[activeTabItem.increment_24h > 0?'text-success':'text-danger',triggerBtn && 'justify'||'']">
                  <span>
                    {{ activeTabItem.current | bigRound(activeTabItem.dictionary.price_scale) }}
                    <svg-icon :icon-class="activeTabItem.increment_24h > 0?'up':'down'" />
                  </span>
                  <el-link v-if="triggerBtn" :underline="false" type="info" @click="dataLoaded(true)">{{ $tR(`mapDelegateList.return-dish`) }}</el-link>
                </p>
                <p v-show="!triggerBtn">{{ activeIndexItem.current }} / {{ handleDishInfoItem('markPrice') }}</p>
              </div>
              <div v-for="(value,key) in mapInformation" :key="key" flex="main:justify">
                <p>{{ $tR(`mapInformation.${key}`) }}</p>
                <p>{{ $tR(`mapInformation.${key}`) }}</p>
              </div>
            </div>
          </div>
        </td>
      </tr><tr /><tr />
    </tbody>
  </table>
</template>

<script>
import candlestick from '@/components/candlestick'
import selectBase from '@/components/selectBase'
import soket from './soket'
import { bigRound, logogramNum, bigDiv, bigTimes, bigPlus, bigMinus, getCost } from '@/utils/handleNum'
import {
  getFutureListByKey,
  getSymbolList,
  getBalanceList,
  getClosedpositionList,
  getActiveorders,
  getActivetriggers,
  getActiveOrderhistory,
  getActiveOrderfills,
  WSURL,
  getRates,
  submitOrder,
  getAllAmount
} from '@/api/contract'
import depthMap from './components/depth-map'
import shipping from './components/shipping'
import customTable from '@/components/customTable'
import dropdown from '@/components/dropdown'
export default {
  name: 'Contract',
  components: {
    candlestick,
    selectBase,
    depthMap,
    customTable,
    shipping,
    dropdown
  },
  mixins: [soket],
  data() {
    return {
      activeTabkey: '',
      activeBtnsKey: '1',
      activePriceType: {},
      activeLever: '0',
      activeTableTabKey: 'shipping',
      activeAcountAndPriceArr: [],
      isBuy: true,
      triggerBtn: false,
      dataDeep: '1',
      delegateData: null,
      newBargainListData: [],
      holdingCount: 0,
      take_rate: 0,

      tickersData: null,
      products: [],
      websokets: [],

      tableList: null,

      currencyRates: null,

      buyBtnLoading: false,
      amountObj: null
    }
  },
  computed: {
    // mapTabs() {
    //   return this.chineseLangData.mapTabs
    // },
    userData() {
      return this.$store.state.userData
    },
    mapDishInfo() {
      return this.chineseLangData.mapDishInfo
    },
    mapHeader1() {
      return this.chineseLangData.mapDelegateList.mapHeader1
    },
    mapHeader2() {
      return this.chineseLangData.mapDelegateList.mapHeader2
    },
    mapFormContent() {
      return this.chineseLangData.mapFormContent
    },
    mapInformation() {
      return this.chineseLangData.mapInformation
    },
    mapTableTapContents() {
      return this.chineseLangData.mapTableTapContents
    },
    activeTabItem() {
      return this.matchFutureItemByKey(this.activeTabkey)
    },
    futurePriceScale() {
      return this.tickersData.FUTURE.reduce((prev, curr) => {
        prev[curr.pair] = (curr.dictionary || {}).price_scale
        return prev
      }, {})
    },
    activeMarkItem() {
      return this.tickersData.MARKET.find(item => this.activeTabkey.includes(item.pair.split('_')[1]))
    },
    markData() {
      return this.products.reduce((prev, curr) => {
        prev[curr.currency] = this.tickersData.MARKET.find(item => item.pair.includes(curr.currency)).current
        return prev
      }, {})
    },
    activeIndexItem() {
      if (!this.tickersData) return {}
      return this.tickersData.INDEX.find(item => this.activeTabkey.includes(item.pair.split('_')[1]))
    },
    activeTotalToBTC() {
      const arr = [this.activeTabItem.volume_24h, this.activeTabItem.current]
      return this.activeTabkey === 'FUTURE_BTCUSD' ? bigDiv(arr) : bigTimes([...arr, this.activeTabItem.dictionary.multiplier])
    },
    isMatchBuy() {
      return this.activeTabkey === 'FUTURE_BTCUSD' ? this.isBuy : this.activeTabItem.increment_24h > 0
    },
    asks() {
      const arr = [...this.delegateData.asks]
      let max = 0
      arr.forEach((item, index, arr) => {
        max = Math.max(item.values[1], max)
        item.values[2] = index > 0 ? bigPlus([item.values[1], arr[index - 1].values[2]], 0) : item.values[1]
      })
      return { arr: arr.reverse(), max }
    },
    bids() {
      const arr = [...this.delegateData.bids]
      let max = 0
      arr.forEach((item, index, arr) => {
        max = Math.max(item.values[1], max)
        item.values[2] = index > 0 ? bigPlus([item.values[1], arr[index - 1].values[2]], 0) : item.values[1]
      })
      return { arr, max }
    },
    mapHandlers() {
      return {
        shipping: getBalanceList,
        shipped: getClosedpositionList,
        curEntrust: getActiveorders,
        lossEntrust: getActivetriggers,
        historyEntrust: getActiveOrderhistory,
        bargain: getActiveOrderfills
      }
    },
    tableColumns() {
      let mapTableColumns = this.mapTableTapContents[this.activeTableTabKey].mapTableColumns
      if (this.activeTableTabKey !== 'shipping') {
        mapTableColumns = Object.keys(mapTableColumns).map(key => ({
          hearderLabel: this.$tR(`mapTableTapContents.${this.activeTableTabKey}.mapTableColumns.${key}`),
          prop: key,
          // hearderWidth: key => ['amount', 'trade_type', 'amount'].includes(key) && '50px',
          handleValue: (value, key, row) => {
            switch (key) {
              case 'executed':
                return `${value}/${row.amount - value}`
              case 'type':
                return +value < 4 ? this.$tR(`mapFormContent.mapBtns.${value}.text`) : this.$tR(`mapFormContent.mapMenuOptions.${value}`)
              case 'state':
                return this.$tR(`state.${value}`)
              case 'tp_type':
                return `${value}/${row.sl_price}`
              case 'create_time':
                return this.parseTime(value)
              // case 'sett_time':
              //   return this.parseTime(value)
              default:
                return value
            }
          }
        }))
      }
      return mapTableColumns
    },
    lastColumnConfig() {
      return {
        headerLabel: '操作',
        headerAlign: 'left',
        width: '50px'
      }
    },
    menuOptions() {
      const options = this.mapFormContent.mapMenuOptions
      const arr = Object.keys(options).map(key => ({
        label: this.$tR(`mapFormContent.mapMenuOptions.${key}`),
        key,
        click: item => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.activeBtnsKey = '3'
        }
      }))
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activePriceType = arr[0]
      return arr
    },
    buyCost() {
      const activeLever = !+this.activeLever ? 100 : +this.activeLever
      const count = this.holdingCount < 0 ? this.activeAcountAndPriceArr[0] + this.holdingCount : this.activeAcountAndPriceArr[0]
      const params = { count, price: this.activeAcountAndPriceArr[1] || this.activeTabItem.current, leverages: activeLever, IM: this.activeTabItem.dictionary.im, take_rate: this.take_rate }
      return getCost(params)
    },
    sellCost() {
      const activeLever = !+this.activeLever ? 100 : +this.activeLever
      const count = this.holdingCount > 0 ? this.activeAcountAndPriceArr[0] - this.holdingCount : this.activeAcountAndPriceArr[0]
      const params = { count, price: this.activeAcountAndPriceArr[1] || this.activeTabItem.current, leverages: activeLever, IM: this.activeTabItem.dictionary.im, take_rate: this.take_rate }
      return getCost(params)
    },
    mapLever() {
      if (!this.activeTabItem.dictionary) return []
      return this.activeTabItem.dictionary.leverages.split(',')
    }
  },
  async created() {
    this.products = (await getSymbolList()).data
    await this.openWebSocket('/market/tickers', this.handleTickers)
    this.openWebSocket(WSURL, res => {
      if (res) this.handleAmountObj()
    }, websocket => websocket.send('{"op":"login","args":["8be85859c7e2d88c87d6e31d650c6cef","8c7d5d714632ece63bc2eef4301acf94c121ea23065f2456f28e083485e558a1"]}')).then((websocket) => {
      websocket.send('{"op":"subscribe","args":["orderfills"]}')
      // websocket.send('{"op":"subscribe","args":["orderupdate"]}')
    })
    this.handleAmountObj()
    this.handleTabClick('FUTURE_BTCUSD')
    this.currencyRates = (await getRates({ currency: 'BTC' })).data
  },
  methods: {
    async handleAmountObj() {
      const { holding_amount: shipped, active_amount: curEntrust, active_triggers_amount: lossEntrust, active_orders_amount: historyEntrust, orders_amount: bargain } = (await getAllAmount()).data
      const data = this.amountObj && JSON.parse(JSON.stringify(this.amountObj))
      const obj = {
        shipping: [shipped, data && data.shipping[0] !== shipped],
        shipped: [shipped, false],
        curEntrust: [curEntrust, data && data.curEntrust[0] !== curEntrust],
        lossEntrust: [lossEntrust, data && data.lossEntrust[0] !== lossEntrust],
        historyEntrust: [historyEntrust, data && data.historyEntrust[0] !== historyEntrust],
        bargain: [bargain, data && data.bargain[0] !== bargain]
      }
      obj[this.activeTableTabKey][1] = false
      this.amountObj = obj
      this.handleTableTabClick(this.activeTableTabKey)
    },
    translateByRate(value) {
      if (!this.currencyRates) return
      return bigTimes([this.currencyRates['USD'], value])
    },
    handleTickers(data) {
      const matchArr = ['FUTURE', 'INDEX', 'MARKET']
      const dictionary = [...this.products]
      const dataArr = data.filter(item => matchArr.includes(item.pair.split('_')[0]))
      const objArr = dataArr.reduce((curr, prev) => {
        const key = prev.pair.split('_')[0]
        const index = dictionary.findIndex(item => item.name === prev.pair)
        index !== -1 && (prev.dictionary = dictionary.splice(index, 1)[0])
        curr[key] = [...(curr[key] || []), prev]
        return curr
      }, {})
      this.tickersData = objArr
    },
    calcIncreaseRate(item) {
      return bigDiv([bigTimes([item.increment_24h, 100]), bigMinus([item.current, item.increment_24h])], Math.max(2, item.dictionary.price_scale))
    },
    matchFutureItemByKey(key) {
      if (!this.tickersData) return {}
      return this.tickersData.FUTURE.find(item => item.pair === key)
    },
    handleDishInfoItem(key) {
      const price_scale = this.activeTabItem.dictionary.price_scale
      if (key === 'markPrice') {
        const fixed = this.activeTabkey === 'FUTURE_BTCUSD' ? 2 : price_scale
        return bigRound(this.activeMarkItem.current, fixed)
      } else {
        const fixed = key === 'change_24h' ? 2 : price_scale
        const unit = this.activeTabkey === 'FUTURE_BTCUSD' ? 'USD' : this.$tR(`sheet`)
        return key === 'volume_24h' ? logogramNum(this.activeTabItem[key]) + unit : bigRound(this.activeTabItem[key], fixed)
      }
    },
    handleTabClick(key) {
      if (this.activeTabkey === key) return
      this.delegateData = null
      this.newBargainListData = []
      if (this.activeTabkey) {
        this.closeWebSocket(`/orderbook/${this.activeTabkey}/0/1/20`)
        this.closeWebSocket(`/deal/${this.activeTabkey}`)
      }
      this.openWebSocket(`/orderbook/${key}/0/1/20`, data => {
        this.delegateData = data
      }).then(res => { this.$nextTick(() => this.dataLoaded()) })
      getFutureListByKey(key, { size: 16 }).then(res => (this.newBargainListData = res.data)).then(res => {
        this.openWebSocket(`/deal/${key}`, data => {
          const last = data[data.length - 1]
          this.newBargainListData.length = this.newBargainListData.length - 1
          this.newBargainListData.unshift(last)
          this.isBuy = last.side === 'buy'
        })
      })
      this.activeTabkey = key
    },
    async handleTableTabClick(key) {
      this.tableList = null
      this.activeTableTabKey = key
      let data = (await this.mapHandlers[key]()).data
      if (Array.isArray(data)) {
        data = key === 'shipping' ? data.filter(item => !!+item.holding).map(item => {
          item.price = this.bigRound(item.price, this.futurePriceScale[`FUTURE_${item.currency}`])
          item.value = bigDiv([item.holding, item.price], 8)
          return item
        }) : data.map(item => {
          item.realized = this.bigRound(item.realized, 8)
          return item
        })
      } else data = data.data
      this.tableList = data.map(item => {
        key === 'shipped' && (item.symbol = this.$tR(`mapTabs.FUTURE_${item.symbol}`))
        key === 'curEntrust' && (item.symbol = this.$tR(`mapTabs.${item.symbol}`))
        return item
      })

      // key === 'shipping' && (this.amountObj.shipping[0] = this.tableList.length)
      const found = this.tableList.find(item => this.activeTabItem.pair.includes(item.currency))
      this.activeLever = found && found.leverage || this.activeLever
      this.holdingCount = found && found.holding || +this.holdingCount
      this.take_rate = found && found.take_rate || +this.take_rate
    },
    matchClassByKey(key) {
      return ['current', 'change_24h', 'increment_24h'].includes(key) ? this.isBuy ? 'text-success' : 'text-danger' : ''
    },
    dataLoaded(lessPosition) {
      const element = this.$refs['content-wrap']
      const centerEle = document.querySelector('.content-center') || {}
      element.scrollTop = (element.scrollHeight - element.clientHeight + (lessPosition ? centerEle.clientHeight || 0 : 0)) / 2
      element.removeEventListener('scroll', this.handleScroll)
      element.addEventListener('scroll', this.handleScroll)
    },
    handleScroll(e) {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        const constHeight = (e.target.scrollHeight - e.target.clientHeight) / 2
        this.triggerBtn = Math.abs(e.target.scrollTop - constHeight) > (e.target.clientHeight / 2)
      }, 100)
    },
    handleWidthBg(amount, max) {
      return Number(bigDiv([amount, max])) * 100 + '%'
    },
    handleSwitch(btnKey) {
      this.activeBtnsKey = btnKey
    },
    submitOrder(side) {
      // const product = this.activeTabItem.dictionary
      this.buyBtnLoading = true
      console.log(this.activeAcountAndPriceArr[1] || this.activeTabItem.current)

      const data = {
        user_id: this.userData.id,
        amount: this.activeAcountAndPriceArr[0],
        price: this.activeAcountAndPriceArr[1] || this.activeTabItem.current,
        type: this.activeBtnsKey, // 下单类型 1 限价 2市价 3限价止损 4市价止损 5限价止盈 6市价止盈
        side,
        symbol: this.activeTabItem.pair,
        leverage: this.activeLever

        // passive 是否被动委托 0否 1是

        // trigger_price 触发价格
        // trigger_type 触发类型 0默认 1盘口价格 2标记价格 3指数价格
        // trigger_close 触发后平仓 0未勾选 1勾选
        // tp_type 止盈触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
        // tp_price 止盈价格
        // sl_type 止损触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
        // sl_price 止损价格
      }
      submitOrder(data).then(res => {
        this.$message.success('操作成功')
        this.handleAmountObj()
        setTimeout(() => {
          this.buyBtnLoading = false
        }, 500)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-container{
  .tabs-group,.dish-info,.delegate-list,.form-content,.hold-content,.order-list,.information{
    box-sizing: border-box;
    width:100%;
    height: 100%;
    line-height: 24px;
    position: relative;
    & > .header{
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      background: $--contract-table-active;
      padding: 0 10px;
    }
  }
  .tabs-group{
    &>div{
      // padding: 0 20px;
      flex-basis: 100px;
      margin-right:2px;
      &:hover{
        background:$--contract-table-active;
        cursor: pointer;
      }
      &.active{
        background: $--contract-table-active;
      }
    }
  }

  .dish-info{
    display: flex;
      align-items: center;
      position: relative;
      & .title{
        border: 1px solid $--color-primary;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        &>.round{
          margin-right: 10px;
          color: $--color-primary;
        }
      }
      & >div.calculator{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 16px;
      }
      .info-left{
        margin: 0 30px;
        line-height: 32px;
        font-size: 12px;
      }
      .info-list-box{
        flex-basis: 500px;
        font-size: 12px;
        display: flex;
        flex-wrap: wrap;
        text-align: left;
        line-height: 32px;
        &>div{
          flex-basis: 150px;
        }
      }
  }

  .delegate-list{
    .content-header{
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border-bottom: 1px solid $--contract-table-bd;
      font-size: 12px;
    };
    &>.content-wrap{
      position: absolute;
      width: 100%;
      height: calc(100% - 64px);
      overflow-y:scroll;
      scroll-behavior:smooth;
      &::-webkit-scrollbar {
          display: none;
          width: 0px;
          height: 10px;
        }
      &::-webkit-scrollbar-thumb {
        background: $--contract-table-bg;
        border: none;
      }
      &>.content-container{
        position: absolute;
        width: 100%;
        font-size: 12px;
        &>.content-center{
          position: sticky;
          line-height: 32px;
          top: 0;
          bottom: 0;
          background: $--contract-table-active;
          margin: 10px 0;
          font-size: 16px;
          z-index: 3;
          &>.justify{
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
          }
        }
        &>ul{
          padding: 0 10px;
          &>li>.mark-bg{
            position: absolute;
            height: 24px;
            z-index: 0;
            opacity: .1;
            right: 0;
            transition: width .5s ease-in-out;
            &.is-buy{
              background: $--color-danger;
            }
            &.is-sell{
              background: $--color-success;
            }
          }
          // text-align: right
        }
      }
    }
  }

  .form-content{
    .custom-btn{
      background:#1c2435;
      border-color:#333;
      color: #ccc;
      width: 100%;
      &.active,&:hover{
        border:1px solid $--color-primary;
        color: $--color-primary
      }
    }
    &>.content-container-submit{
      padding:0 8px;
      line-height: 32px;
      text-align: left;
      &>*{
        margin-top: 20px;
        &>input,&>.transactionPrice{
          background: transparent;
          border: 1px solid #333;
          text-align: center;
          color: #ddd;
          box-sizing: border-box;
          width: 70%;
          font-size: 12px;
        }
        &>input{
          text-align: right;
          padding-right: 45px;
        }
        &>span{
          position:absolute;
          right:14px;
          color:#999;
          border-left: 1px solid #333;
          padding-left: 4px;
        }
      }
    }
  }
  .hold-content{
    &>.content-container-hold{
      font-size: 12px;
      padding: 0 8px;
      &>*{
        margin-top: 6px;
      }
      &>.linear-bar{
        position: relative;
        box-sizing: border-box;
        height: 30px;
        background: linear-gradient(90deg, #09c989 0%, #f24e4d 100%);
        padding:0 8px;
        &>.mark{
          position: absolute;
          padding-left: 10px;
          height: 100%;
          line-height: 30px;
          border-left: 1px solid #fff;
          left: 20%;
        }
      }
      &>.multiple-bar{
        text-align: left
        // position: relative;
        // margin-top: 20px;
        // .leverItem{
        //   span{
        //     transition: transform .2s linear;
        //     width: 8px;
        //     height: 8px;
        //     border-radius: 50%;
        //     background: #f0f0f0;
        //   }
        //   &:hover,&.active{
        //     cursor: pointer;
        //     background: $--color-primary;
        //     color: $--color-primary
        //     span{
        //       transform: scale(1.5)
        //     }
        //   }
        // }
        // &>.dot-wrap{
        //   position: absolute;
        //   width: calc(100% + 4px);
        //   margin-top: -10px;
        //   margin-left:-2px;
        //   span{
        //     font-size: 30px;
        //     transition: transform .2s linear;
        //     &:hover,&.active{
        //       cursor: pointer;
        //       transform: scale(1.5)
        //     }
        //   }
        // }
      }
    }
  }
  .order-list{
    &>.header{
      padding: 0;
      &>*{
        border-right:1px solid #000;
        transition: all .5s ease-in-out;
        &:hover,&.active{
          box-shadow: 0 2px 0 0 $--color-primary inset;
          background: $--contract-table-bg;
          cursor: pointer;
        }
      }
    }
    .order-list-content{
      height: 200px;
      overflow: auto;
      &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
      }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      background   : #000;
      }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background   : $--contract-table-bg
      }
    }
  }
}

table.table-container{
  width: 100%;
  table-layout: fixed;
  background:$--contract-table-bg;
  color: #d7d7d7;
  box-sizing: border-box;
  border-collapse: collapse;
  text-align: center;
  height: calc(100vh - 60px);
  overflow: hidden;
  font-size: 14px;
  tr{
    height: 50px;
    td{
      border-width:4px;
      border: solid 4px $--contract-table-bd;
    }
  }
}
tr.contract-order-list-row-class{
  background:$--contract-table-bg;
  &:hover>td{
    background: $--contract-table-active!important;
  }
  th.is-leaf{
    background: $--contract-table-bg;
    border-color: rgb(27, 28, 29);
  }
  td{
    border-color: rgb(27, 28, 29);
  }
}
</style>
