<template>
  <table class="table-container" border="1" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td colspan="3">
          <div v-loading="!products.length" element-loading-background="rgba(0, 0, 0, 0.3)" style="height:100%">
            <div flex="main:left cross:strech" class="tabs-group">
              <div v-for="(product,index) in products" :key="index" :class="{active:activeProduct.name === product.name}" flex="dir:top main:center" @click="handleProductsChange(product)">
                <p>{{ $tR(`mapTabs.${product.name}`) }}</p>
                <span v-if="product.UNIT" :class="[product.UNIT.increment_24h > 0?'text-success':'text-danger']">
                  {{ calcIncreaseRate(product) }}%
                  <svg-icon :icon-class="product.UNIT.increment_24h > 0?'lv':'hong'" />
                </span>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div v-loading="!delegateData" class="delegate-list" element-loading-background="rgba(0, 0, 0, 0.3)" style="height:100%">
            <div class="header" flex="main:justify">
              <span> {{ $tR(`mapDelegateList.entrust-list`) }}</span>
              <selectBase v-model="dataDeep" :handle-label="value=>`${$tR(`mapDelegateList.depth`)}${value}`" :map-data="mapDeepData" />
            </div>
            <div class="content-header" flex="main:justify">
              <span v-for="(value,key) in mapHeader1" :key="key">{{ $tR(`mapDelegateList.mapHeader1.${key}`) }}</span>
            </div>
            <div v-if="delegateData && activeProduct.UNIT" ref="content-wrap" class="content-wrap">
              <div class="content-container">
                <ul>
                  <li v-for="(item,index) in asks.arr" :key="index" flex="main:justify cross:center">
                    <span class="text-danger" @click="userData && (activeAcountAndPriceArr[1]=item.values[0])">{{ item.values[0] | bigRound(activeProduct.price_scale) }}</span>
                    <span style="flex:1" @click="userData && (activeAcountAndPriceArr[0]=item.values[1])">{{ item.values[1] | bigRound(0) }}</span>
                    <span>{{ item.values[2] }}</span>
                    <div class="mark-bg is-buy" :style="{width:handleWidthBg(item.values[1],asks.max)}" />
                  </li>
                </ul>
                <div class="content-center">
                  <p :class="[isBuy?'text-success':'text-danger',triggerBtn && 'justify'||'']">
                    <span>
                      {{ activeProduct.UNIT.current | bigRound(activeProduct.price_scale) }}
                      <svg-icon :icon-class="isBuy?'lv':'hong'" />
                    </span>
                    <el-link v-if="triggerBtn" :underline="false" type="info" @click="dataLoaded(true)">{{ $tR(`mapDelegateList.return-dish`) }}</el-link>
                  </p>
                  <p v-show="!triggerBtn">{{ activeProduct.INDEX.current }} / {{ handleDishInfoItem('markPrice') }}</p>
                </div>
                <ul>
                  <li v-for="(item,index) in bids.arr" :key="index" flex="main:justify cross:center">
                    <span class="text-success" @click="userData && (activeAcountAndPriceArr[1]=item.values[0])">{{ item.values[0] | bigRound(activeProduct.price_scale) }}</span>
                    <span style="flex:1" @click="userData && (activeAcountAndPriceArr[0]=item.values[1])">{{ item.values[1] | bigRound(0) }}</span>
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
                    <span :class="[item.side === 'buy'?'text-success':'text-danger']">{{ item.values[0]|bigRound(activeProduct.price_scale) }}</span>
                    <span>{{ item.values[1] }}</span>
                    <span>{{ item.time | parseTime('{h}:{i}:{s}') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div v-login class="form-content">
            <div class="header" flex="main:justify">
              <span> {{ $tR(`mapFormContent.submitEntrust`) }}</span>
            </div>
            <div v-loading="!activeProduct.UNIT" element-loading-background="rgba(0, 0, 0, 0.3)" class="content-container-submit">
              <div v-if="activeProduct.UNIT" flex="main:justify">
                <div v-for="(value,key) in mapFormContent.mapBtns" :key="key" :class="{active:activeBtnsKey === key}">
                  <dropdown v-if="key === '3'" v-model="activePriceType" :menu-options="menuOptions" label="label">
                    <el-button class="custom-btn" :class="{active:activeBtnsKey === key}" size="small" plain @click="handleSwitch(key)">
                      {{ activePriceType.label }} <i class="el-icon-caret-bottom" />
                    </el-button>
                  </dropdown>
                  <el-tooltip v-else placement="bottom" effect="dark" popper-class="custom-tooltip">
                    <div slot="content" style="width:200px;font-size:12px;line-height:20px">{{ $tR(`mapFormContent.mapBtns.${key}.describe`) }}</div>
                    <el-button class="custom-btn" :class="{active:activeBtnsKey === key}" size="small" plain @click="handleSwitch(key)">
                      {{ $tR(`mapFormContent.mapBtns.${key}.text`) }}
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div v-for="(value,key,i) in mapInput" :key="key" flex="main:justify">
                <label for="">{{ $tR(`mapFormContent.mapInput.${key}`) }}</label>
                <div v-if="i===1 && (activeBtnsKey === '3'?!(+activePriceType.key % 2):activeBtnsKey === '2')" class="transactionPrice" flex="main:justify box:mean">
                  <div style="color: #666;">{{ $tR(`mapFormContent.perfactPrice`) }}</div>
                </div>
                <template v-else>
                  <div v-if="key === 'triggerType'" class="transactionPrice">
                    <el-select v-model="trigger_type" size="small" class="custom-select">
                      <el-option v-for="(subValue,subKey) in mapFormContent.mapTriggerType" :key="subKey" :label="$tR(`mapFormContent.mapTriggerType.${subKey}`)" :value="+subKey" />
                    </el-select>
                  </div>
                  <template v-else>
                    <input :value="(i===0 || i===2) ? activeAcountAndPriceArr[i]:(activeAcountAndPriceArr[i]||(activeProduct.UNIT||{}).current)" type="text" @input="e=>activeAcountAndPriceArr[i] = e.target.value.replace(/^(0+)|[^\d.]+/g,'')">
                    <span>USD</span>
                  </template>
                </template>
              </div>
              <div>
                <div flex="main:justify">
                  <el-checkbox v-model="popoverDisabled">{{ $tR(`mapFormContent.notip`) }}</el-checkbox>
                  <el-checkbox v-if="+activeBtnsKey > 2" v-model="trigger_close ">{{ $tR(`mapFormContent.trigger_close`) }}</el-checkbox>
                </div>
                <div v-for="(value,key) in mapFormContent.mapHandleBtn" :key="key">
                  <el-popover
                    :ref="`popover-${key}`"
                    placement="right"
                    :popper-class="`contrat-popper-${key === 'buy'?'success':'danger'}-class`"
                    width="400"
                    trigger="click"
                    :disabled="popoverDisabled"
                    :title="handlePopoverTitle(key)"
                  >
                    <orderPopover v-if="activeProduct.UNIT" v-model="activeLever" :active-product="activeProduct" :loading="buyBtnLoading" :form-value-obj="formValueObj" :data="mapLever" :type="key === 'buy'?'success':'danger'" @change="setLeverage" @command="handleCommandOrder" />
                    <el-button slot="reference" :type="key === 'buy'?'success':'danger'" :class="{activeBtn:isBuy ? key === 'buy': key === 'sell'}" :loading="buyBtnLoading" :disabled="handleDisabledBtn(key)" style="width:100%" @click="handlePopoverClick(key)">
                      <div v-show="!buyBtnLoading" flex="main:justify cross:center">
                        <span>{{ $tR(`mapFormContent.mapHandleBtn.${key}`) }}</span>
                        <span v-if="activeBtnsKey === '1'" style="font-size:12px">{{ activeAcountAndPriceArr[0] }} @ {{ activeAcountAndPriceArr[1]||(activeProduct.UNIT||{}).current }} USD</span>
                        <span v-else-if="activeBtnsKey === '2'" style="font-size:12px">{{ activeAcountAndPriceArr[0] }} @ {{ key === 'buy'?asks.last[0]:bids.first[0] }} USD</span>
                        <span v-else-if="activeBtnsKey === '3'" style="font-size:12px">
                          <span v-if="activePriceType.key === '4'">{{ activeAcountAndPriceArr[0] }} @ {{ (activeProduct.UNIT||{}).current }}</span>
                          <span>{{ key === 'buy'? '≦':'≧' }} {{ (activeProduct.UNIT||{}).current }}</span>
                        </span>
                      </div>
                    </el-button>
                  </el-popover>

                  <p style="font-size:12px;color:#999">{{ $tR(`mapFormContent.cost`) }}：<span>{{ !activeAcountAndPriceArr[0]?'--':costObj[key] }}</span> {{ activeProduct.currency }}</p>
                </div>
                <!-- <hr> -->
                <div v-for="(value,key) in mapFormContent.mapDescribe" :key="key" style="font-size:12px;line-height:24px" flex="main:justify">
                  <span>{{ $tR(`mapFormContent.mapDescribe.${key}`) }}</span>
                  <span v-if="key === 'entrustValue'" class="text-warning">{{ formValueObj[1] | bigRound(8) }} {{ activeProduct.currency }}</span>
                  <el-link v-else style="font-size:12px" type="primary">{{ (activeBalance||{}).available_balance||0| bigRound(8) }}  {{ activeProduct.currency }}</el-link>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="1">
          <div v-loading="!activeProduct.UNIT" class="dish-info" element-loading-background="rgba(0, 0, 0, 0.3)">
            <template v-if="activeProduct.UNIT">
              <div class="info-left">
                <div class="title">
                  <svg-icon icon-class="star" class="round" />
                  {{ $tR(`mapTabs.${activeProduct.name}`) }}
                  <svg-icon :class="[activeProduct.UNIT.increment_24h > 0?'text-success':'text-danger']" :icon-class="activeProduct.UNIT.increment_24h > 0?'lv':'hong'" />
                </div>
                <span>{{ $tR(`mapInformation.valueRate`) }}： {{ symbolInfo.fee_rate | bigRound(8) }}</span>
                <span>
                  <el-tooltip content="Global Size" effect="dark" placement="bottom">
                    <i class="el-icon-bell" />
                  </el-tooltip>
                </span>
              </div>
              <div class="info-list-box">
                <div v-for="(value,key) in mapDishInfo" :key="key">
                  {{ $tR(`mapDishInfo.${key}`) }}：
                  <span :class="[matchClassByKey(key)]">{{ handleDishInfoItem(key) }}{{ key === 'change_24h' && '%' ||'' }}</span>
                </div>
                <div>≈ {{ calcToBTC }} {{ activeProduct.currency }}</div>
              </div>
            </template>

            <div class="calculator"><i class="el-icon-caret-bottom" />计算器</div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="8">
          <candlestick ref="candlestick" />
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
          <div v-loading="false" v-login class="hold-content" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex="main:justify">
              <span> {{ $tR('currentPlace') }}：{{ activeProduct && $tR(`mapTabs.${activeProduct.name}`)||'' }}</span>
            </div>
            <div class="content-container-hold">
              <div flex="box:mean" style="text-align:center">
                <p>{{ (activeBalance||{}).holding || 0 }} <br> {{ $tR('deal') }}</p>
                <p style="border-left:1px solid #333">{{ (activeBalance||{}).unrealized || 0 }} <br> {{ $tR('rateOReturn') }}</p>
              </div>
              <orderPopover
                v-if="activeProduct.UNIT" v-model="activeLever"
                only-lever flex="dir:top"
                :loading="buyBtnLoading" :form-value-obj="formValueObj"
                :active-product="activeProduct" :data="mapLever"
                type="success" @change="setLeverage"
                @command="handleCommandOrder"
              />
              <div flex="main:justify" style="padding:8px">
                <p>{{ $tR('quota') }}</p>
                <p>{{ (activeBalance||{}).unrealized || 0 }}</p>
              </div>
            </div>
          </div>
        </td>
      </tr><tr /><tr />
      <tr>
        <td rowspan="3" colspan="5">
          <div v-login class="order-list">
            <div class="header" flex>
              <div v-for="(value,key) in mapTableTapContents" :key="key" :class="{active:activeTableTabKey === key}" @click="handleTableTabClick(key,amountObj[key][1]=false)">
                <el-badge v-if="amountObj" is-dot :hidden="activeTableTabKey === key ||!amountObj[key][1]">
                  <p style="min-width:120px">{{ $tR(`mapTableTapContents.${key}.text`) }}【{{ amountObj[key][0] }}】</p>
                </el-badge>
                <p v-else style="min-width:120px">{{ $tR(`mapTableTapContents.${key}.text`) }}</p>
              </div>
            </div>
            <div v-loading="!calcTableList" class="order-list-content" element-loading-background="rgba(0, 0, 0, 0.3)">
              <shipping v-if="activeTableTabKey === 'shipping'" :active-product="activeProduct" :mark-data="markData" :data="calcTableList" :table-columns="tableColumns" @change="handleAmountObj" />
              <customTable v-if="activeTableTabKey !== 'shipping' && calcTableList" header-row-class-name="contract-order-list-row-class" row-class-name="contract-order-list-row-class" size="mini" :table-list="calcTableList" :last-column-config="lastColumnConfig" :table-columns="tableColumns">
                <div slot="handlerDom" slot-scope="{data}">
                  <el-button size="mini" type="danger" :loading="data.cancelBtnLoading" @click="cancelOrder(data)">{{ $tR('cancel') }}</el-button>
                </div>
              </customTable>
            </div>
          </div>
        </td>
        <td rowspan="3">
          <div v-loading="!delegateData" class="information" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="header" flex="main:justify">
              <span> 深度图</span>
            </div>
            <div v-if="delegateData && activeProduct.UNIT" class="information-content">
              <div class="content-center">
                <p :class="[isBuy?'text-success':'text-danger',triggerBtn && 'justify'||'']">
                  <span>
                    {{ activeProduct.UNIT.current | bigRound(activeProduct.price_scale) }}
                    <svg-icon :icon-class="isBuy?'lv':'hong'" />
                  </span>
                  <el-link v-if="triggerBtn" :underline="false" type="info" @click="dataLoaded(true)">{{ $tR(`mapDelegateList.return-dish`) }}</el-link>
                </p>
                <p v-show="!triggerBtn">{{ activeProduct.INDEX.current }} / {{ handleDishInfoItem('markPrice') }}</p>
              </div>
              <hr>
              <div v-for="(value,key) in mapInformation" :key="key" flex="main:justify">
                <p>{{ $tR(`mapInformation.${key}`) }}</p>
                <p>{{ information[key] }}</p>
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
import soket from '@/mixins/resoket'
import { bigRound, logogramNum, calcValueByAmountAndPrice, bigDiv, bigTimes, bigPlus, bigMinus, getCost, getLiqPrice, getTotalValue } from '@/utils/handleNum'
import {
  // getSymbolInfo,
  getFutureListByKey,
  getSymbolList,
  getBalanceList,
  getClosedpositionList,
  getActiveorders,
  getActivetriggers,
  getActiveOrderhistory,
  getActiveOrderfills,
  // getRates,
  submitOrder,
  cancelOrder,
  getAllAmount,
  // getFinanceRecord,
  setLeverage
  // getKlineHistoryList
} from '@/api/currencyUnit'
import depthMap from './components/depth-map'
import orderPopover from './components/orderPopover'
import shipping from './components/shipping'
import customTable from '@/components/customTable'
import dropdown from '@/components/dropdown'
// import { mapPeriod } from '@/const'
export default {
  name: 'Contract',
  components: {
    candlestick,
    selectBase,
    depthMap,
    customTable,
    shipping,
    dropdown,
    orderPopover
  },
  mixins: [soket],
  data() {
    return {
      activeProduct: '',
      activeBtnsKey: '1',
      activePriceType: {},
      activeLever: '0',
      activeTableTabKey: 'shipping',
      activeAcountAndPriceArr: [undefined, undefined, undefined],
      isBuy: true,
      triggerBtn: false,
      trigger_type: 1,
      trigger_close: false,
      dataDeep: '1',

      delegateData: null,
      newBargainListData: [],
      holdingCount: 0,
      take_rate: 0,

      tickersData: null,
      products: [],
      entrustList: null,

      tableList: null,

      buyBtnLoading: false,
      cancelBtnLoading: false,
      amountObj: null,
      balanceList: [],

      popoverDisabled: false,

      symbolInfo: {}

    }
  },
  computed: {
    // mapTabs() {
    //   return this.langData.mapTabs
    // },
    mapDeepData() {
      return Array.from({ length: this.activeProduct.price_scale + 1 }).map((e, index) => {
        return 1 / Math.pow(10, index)
      })
    },
    formValueObj() {
      if (!this.activeProduct.UNIT || !this.costObj || !this.activeBalance || !this.activeProduct.MARKET) return {}
      const price = this.activeAcountAndPriceArr[1] || this.activeProduct.UNIT.current
      const getLiqPrice = this.getLiqPrice()
      return {
        1: calcValueByAmountAndPrice(this.activeAcountAndPriceArr[0], price),
        2: this.costObj[this.side === 1 ? 'buy' : 'sell'],
        3: this.activeBalance.available_balance,
        4: +this.activeBalance.holding + (this.side === 2 ? -this.activeAcountAndPriceArr[0] : +this.activeAcountAndPriceArr[0]),
        5: this.activeProduct.MARKET.current,
        6: getLiqPrice,
        7: 1 - (this.activeProduct.UNIT.current - getLiqPrice) / this.activeProduct.UNIT.current
      }
    },
    userData() {
      return this.$store.state.userData
    },
    mapDishInfo() {
      return this.langData.mapDishInfo
    },
    mapHeader1() {
      return this.langData.mapDelegateList.mapHeader1
    },
    mapHeader2() {
      return this.langData.mapDelegateList.mapHeader2
    },
    mapFormContent() {
      return this.langData.mapFormContent
    },
    mapInput() {
      // eslint-disable-next-line no-unused-vars
      const { triggerPrice, triggerType, ...data } = this.mapFormContent.mapInput
      return +this.activeBtnsKey > 2 ? this.mapFormContent.mapInput : data
    },
    mapInformation() {
      return this.langData.mapInformation
    },
    mapTableTapContents() {
      return this.langData.mapTableTapContents
    },
    markData() {
      return this.products.reduce((prev, curr) => {
        prev[curr.currency] = (curr.MARKET || {}).current
        return prev
      }, {})
    },
    calcToBTC() {
      const arr = [this.activeProduct.UNIT.volume_24h, this.activeProduct.UNIT.current]
      return this.activeProduct.name === 'FUTURE_BTCUSD' ? bigDiv(arr) : bigTimes([...arr, this.activeProduct.multiplier])
    },
    asks() {
      const value = this.bids.first[0]
      const data = Array.from({ length: 10 }).map((item, index) => {
        const obj = { values: [+value + index, 100] }
        return obj
      })
      const arr = [...(this.delegateData.asks || data)]
      let max = 0
      arr.forEach((item, index, arr) => {
        max = Math.max(item.values[1], max)
        item.values[2] = index > 0 ? bigPlus([item.values[1], arr[index - 1].values[2]], 0) : item.values[1]
      })
      return { arr: arr.reverse(), max, first: arr[0].values, last: arr[arr.length - 1].values }
    },
    bids() {
      const arr = [...this.delegateData.bids]
      let max = 0
      arr.forEach((item, index, arr) => {
        max = Math.max(item.values[1], max)
        item.values[2] = index > 0 ? bigPlus([item.values[1], arr[index - 1].values[2]], 0) : item.values[1]
      })
      return { arr, max, first: arr[0].values, last: arr[arr.length - 1].values }
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
          class: (value, key, row) => {
            switch (key) {
              case 'amount':
                return row.side === 1 ? 'text-success' : 'text-danger'
              case 'side':
                return row.side === 1 ? 'text-success' : 'text-danger'
              case 'distancePrice':
                return +value > 0 ? 'text-success' : 'text-danger'
              default:
                return ''
            }
          },
          // hearderWidth: key => ['amount', 'trade_type', 'amount'].includes(key) && '50px',
          handleValue: (value, key, row) => {
            switch (key) {
              case 'amount':
                return `${row.side === 2 ? '-' : ''}${value}`
              case 'side':
                return `${row.side === 2 ? this.$tR('sell') : this.$tR('buy')}`
              case 'executed':
                return `${value}/${row.amount - value}`
              case 'type':
                return +value < 4 ? this.$tR(`mapFormContent.mapBtns.${value}.text`) : this.$tR(`mapFormContent.mapMenuOptions.${value}`)
              case 'state':
                return this.$tR(`state.${value}`)
              case 'tp_type':
                return `${value}/${row.sl_price}`
              case 'create_time':
                return this.parseTime(String(value).substring(0, 13))
              case 'distancePrice':
                return `${value > 0 ? '+' : ''}${value}`
              case 'amount_surplus':
                return row.amount_total - row.amount_last || '0'
              case 'fee':
                return this.bigRound(value, 8)
              case 'entrustValue':
                return this.bigRound(calcValueByAmountAndPrice(row.amount, row.price), 8)
              case 'price':
                return this.bigRound(value, 2)
              default:
                return value
            }
          }
        }))
      }
      return mapTableColumns
    },
    lastColumnConfig() {
      return ['curEntrust', 'lossEntrust'].includes(this.activeTableTabKey) ? {
        headerLabel: this.$tR('handle'),
        headerAlign: 'left'
      } : null
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
    costObj() {
      if (!this.activeBalance) return
      const obj = {}
      const price = this.activeAcountAndPriceArr[1] || this.activeProduct.UNIT.current
      // const activeLever = !+this.activeLever ? 100 : +this.activeLever
      if (+this.activeBalance.holding < 0) {
        let buyAmount
        buyAmount = this.activeAcountAndPriceArr[0] - Math.abs(+this.activeBalance.holding)
        buyAmount = buyAmount <= 0 ? 0 : buyAmount
        obj.buy = getCost({ ...this.activeProduct, amount: buyAmount, price }, this.activeLever)
        obj.sell = getCost({ ...this.activeProduct, amount: this.activeAcountAndPriceArr[0], price }, this.activeLever)
      } else {
        let sellAmount
        sellAmount = this.activeAcountAndPriceArr[0] - +this.activeBalance.holding
        sellAmount = sellAmount <= 0 ? 0 : sellAmount
        obj.buy = getCost({ ...this.activeProduct, amount: this.activeAcountAndPriceArr[0], price }, this.activeLever)
        obj.sell = getCost({ ...this.activeProduct, amount: sellAmount, price }, this.activeLever)
      }
      return obj
    },
    mapLever() {
      if (!this.activeProduct) return []
      return this.activeProduct.leverages.split(',')
    },
    updateTableList() {
      return this.tableList && this.tableList.map(item => {
        const distancePrice = bigMinus([item.trigger_price || 0, this.activeProduct.UNIT.current || 0], 2)
        return { ...item, distancePrice }
      }) || []
    },
    calcBalanceList() {
      return this.balanceList.filter(item => !!+item.holding).map(item => {
        const found = (this.entrustList || []).find(subItem => +subItem.id === item.future_close_id)
        if (found)item.closePrice = found.price
        return item
      })
    },
    activeBalance() {
      const found = this.balanceList.find(item => this.activeProduct.currency === item.currency)
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activeLever = found && found.leverage
      return found
    },
    calcTableList() {
      const obj = {
        lossEntrust: this.updateTableList,
        curEntrust: this.entrustList,
        // shipping: !this.calcBalanceList.length ? null : this.calcBalanceList
        shipping: this.calcBalanceList
      }
      return obj[this.activeTableTabKey] ? obj[this.activeTableTabKey] : this.tableList
    },
    information() {
      return {
        priceBy: 'ixx' + this.$tR('index'),
        priceIndex: this.activeProduct.INDEX.current,
        volume_24h: this.handleDishInfoItem('volume_24h'),
        value: '合约价值',
        valueRate: this.symbolInfo.fee_rate
      }
    },
    mapHandlerSoket() {
      return {
        'market': this.handleTickers,
        'orderbook': this.handleOrderbookSoket,
        'deal': this.handleDealSoket,
        'orderfills': this.handleAmountObj,
        'position': this.handleAmountObj
      }
    }
  },
  async created() {
    this.products = (await getSymbolList()).data
    await this.openWebSocket(this.handleSoketData, websocket => {
      this.websocket.send('{"op":"subscribepub","args":["market@ticker"]}')
      if (this.userData) {
        this.websocket.send(`{"op":"loginWeb","args":["${this.userData.session_id}"]}`)
        this.websocket.send('{"op":"subscribe","args":["orderfills"]}')
        this.websocket.send('{"op":"subscribe","args":["position"]}')
      }
      // websocket.send('{"op":"subscribe","args":["orderupdate"]}')
    })
    const queryStr = localStorage.getItem('unit-product') || this.products[0].name
    const product = this.products.find(item => item.name === queryStr)
    this.handleProductsChange(product)
    // this.openWebSocket(WSURL, res => {
    //   if (res && res[0] && !this.cancelBtnLoading && !this.buyBtnLoading) this.handleAmountObj()
    // }, websocket => {
    //   websocket.send('{"op":"login","args":["8be85859c7e2d88c87d6e31d650c6cef","8c7d5d714632ece63bc2eef4301acf94c121ea23065f2456f28e083485e558a1"]}')
    //   websocket.send('{"op":"subscribe","args":["orderfills"]}')
    //   // websocket.send('{"op":"subscribe","args":["orderupdate"]}')
    // })
    this.handleAmountObj()
    // this.handleTabClick('FUTURE_BTCUSD')
    // getFinanceRecord()
  },
  methods: {
    totalValue() {
      if (!this.activeAcountAndPriceArr[0] || !this.entrustList) return
      return getTotalValue(this.entrustList,
        { amount: this.activeAcountAndPriceArr[0],
          price: this.activeAcountAndPriceArr[1] || this.activeProduct.UNIT.current },
        this.activeProduct.multiplier)
    },
    getLiqPrice() {
      if (!this.activeAcountAndPriceArr[0]) return
      const price = getLiqPrice({
        isBuy: this.isBuy,
        leverages: this.activeLever,
        amount: this.activeAcountAndPriceArr[0],
        price: this.activeAcountAndPriceArr[1] || this.activeProduct.UNIT.current,
        available_balance: this.activeBalance.available_balance,
        totalValue: this.totalValue()
      }, this.activeProduct)
      return price
    },
    handleOrderbookSoket(data) {
      this.delegateData = data
      if (!this._scrolled) {
        this.$nextTick(() => {
          this.dataLoaded()
          this._scrolled = true
        })
      }
    },
    handleDealSoket(data) {
      const last = data[data.length - 1]
      this.newBargainListData.unshift(last)
      this.newBargainListData.pop()
      this.isBuy = last.side === 'buy'
    },
    handleOrderfills(data) {
      const last = data[data.length - 1]
      this.newBargainListData.unshift(last)
      this.newBargainListData.pop()
      this.isBuy = last.side === 'buy'
    },
    handleSoketData(res) {
      const key = res.topic && res.topic.split('@')[0]
      this.mapHandlerSoket[key] && this.mapHandlerSoket[key](res.data)
    },
    handlePopoverTitle(key) {
      const type = this.activeBtnsKey === '3' && this.activePriceType.key || this.activeBtnsKey
      const price = this.activeAcountAndPriceArr[1] || (this.activeProduct.UNIT || {}).current
      const calcPrice = ['2', '4', '6'].includes(type) ? '市场最优价格' : price
      return `
        ${this.$tR(`mapFormContent.mapHandleBtn.${key}`)}--
        ${this.$tR(`mapFormContent.mapBtns.${this.activeBtnsKey}.text`)}【${calcPrice}】-- 
        数量【${this.activeAcountAndPriceArr[0]}】
      `
    },
    handleDisabledBtn(side) {
      if (+this.activeBtnsKey > 2) {
        const comparisonValue = ['3', '4'].includes(this.activePriceType.key) ? +this.activeProduct.UNIT.current : (+this.activeAcountAndPriceArr[1] || +this.activeProduct.UNIT.current)
        const hasValue = this.activeAcountAndPriceArr[0] && this.activeAcountAndPriceArr[2]
        const type = !['3', '4'].includes(this.activePriceType.key) ? 'sell' : 'buy'
        const isSell = side === type ? +this.activeAcountAndPriceArr[2] > comparisonValue : +this.activeAcountAndPriceArr[2] < +comparisonValue
        const res = hasValue && isSell
        return !res
      } else return !this.activeAcountAndPriceArr[0]
    },
    setLeverage(leverage) {
      setLeverage({ name: this.activeProduct.name, leverage }).then(res => {
        this.$message.success(this.$tR('handleSuccess'))
        return Promise.resolve()
      }).then(res => {
        this.handleBalanceList()
      })
    },
    async handleCommandOrder(isSubmit) {
      if (isSubmit) await this.submitOrder()
      this.$root.modelVisible = false
      this.$refs['popover-buy'][0].showPopper = false
      this.$refs['popover-sell'][0].showPopper = false
    },
    handlePopoverClick(side) {
      this.side = side === 'buy' ? 1 : 2
      !this.popoverDisabled && (this.$root.modelVisible = true) || this.submitOrder()
    },
    handleEntrustList() {
      this.entrustList = null
      this.mapHandlers.curEntrust({ size: 20 }).then(res => {
        this.entrustList = res.data.data.map(item => {
          item.cancelBtnLoading = false
          item._symbol = item.symbol
          item.symbol = this.$tR(`mapTabs.${item.name}`)
          return item
        })
      })
    },
    handleBalanceList() {
      // this.balanceList = null
      return this.mapHandlers.shipping().then(res => {
        this.balanceList = res.data.map(item => {
          item.value = !+item.holding ? 0 : bigDiv([item.holding, item.price], 8)
          item.price = this.bigRound(item.price, this.activeProduct['price_scale'])
          item._leverage = item.leverage === '0' ? '全仓' : item.leverage
          // item._symbol = item.symbol
          // item.symbol = this.$tR(`mapTabs.FUTURE_${item.symbol}`)
          return item
        })
        return Promise.resolve()
      })
    },
    handleTickers(data) {
      data.reduce((prev, curr) => {
        const pairArr = curr.pair.split('_')
        const found = prev.find(item => item.currency === pairArr[1])
        found && this.$set(found, pairArr[0], curr)
        return prev
      }, this.products)
    },
    handleProductsChange(product) {
      // ws.send('{"op":"subscribepub","args":["orderbook@FUTURE_BTCUSD@1@2@10"]}')
      // this.websocket.send(`{"op":"subscribepub","args":["orderbook@${product.name}@1@2@10"]}`)
      // this.websocket.send(`{"op":"subscribepub","args":["deal@${product.name}"]}`)
      // this.$nextTick(() => this.dataLoaded())
      // this.newBargainListData = (await getFutureListByKey(product.name, { size: 20 })).data
      localStorage.setItem('unit-product', product.name)
      this.$router.replace({ query: { product: product.name }})
      if (this.activeProduct) {
        this.websocket.send(`{"op":"unsubscribepub","args":["orderbook@${product.product}_${product.currency}@1@2@20"]}`)
        this.websocket.send(`{"op":"unsubscribepub","args":["deal@${product.product}_${product.currency}"]}`)
      }
      this.websocket.send(`{"op":"subscribepub","args":["orderbook@${product.product}_${product.currency}@1@2@20"]}`)
      this.websocket.send(`{"op":"subscribepub","args":["deal@${product.product}_${product.currency}"]}`)
      getFutureListByKey(`${product.product}_${product.currency}`, { size: 20 }).then(({ data }) => {
        this.newBargainListData = data
      })
      // if (this.activeProduct) {
      //   this.closeWebSocket(`/orderbook/${this.activeProduct.name}/0/1/20`)
      //   this.closeWebSocket(`/deal/${this.activeProduct.name}`)
      // }
      // this.openWebSocket(`/orderbook/${product.name}/0/1/20`, data => {
      //   this.delegateData = data
      // }).then(res => { this.$nextTick(() => this.dataLoaded()) })

      // getSymbolInfo({ symbol: product.name }).then(res => {
      //   this.symbolInfo = res.data
      // })
      this.activeProduct = product
      if (!this.$refs.candlestick.tvWidget) {
        this.$refs.candlestick.initTV(`${product.product}_${product.currency}`)
      } else this.$refs.candlestick.tvWidget.chart().setSymbol(`${product.product}_${product.currency}`)
    },
    calcIncreaseRate(product) {
      return bigDiv([bigTimes([product.UNIT.increment_24h, 100]), bigMinus([product.UNIT.current, product.UNIT.increment_24h])], Math.max(2, product.price_scale))
    },
    handleDishInfoItem(key) {
      const price_scale = this.activeProduct.price_scale
      if (key === 'markPrice') {
        const fixed = this.activeProduct.name === 'FUTURE_BTCUSD' ? 2 : price_scale
        return bigRound(this.activeProduct.MARKET.current, fixed)
      } else {
        const fixed = key === 'change_24h' ? 2 : price_scale
        const unit = this.activeProduct.name === 'FUTURE_BTCUSD' ? 'USD' : this.$tR(`sheet`)
        return key === 'volume_24h' ? logogramNum(this.activeProduct.UNIT[key]) + unit : bigRound(this.activeProduct.UNIT[key], fixed)
      }
    },
    handleWidthBg(amount, max) {
      return +bigDiv([amount, max]) * 100 + '%'
    },

    handleAmountObj() {
      if (!this.$store.state.userData) return
      clearTimeout(this._timer)
      return new Promise(resolve => {
        this._timer = setTimeout(async() => {
          await this.handleBalanceList()
          const { holding_amount: shipped, active_amount: curEntrust, active_triggers_amount: lossEntrust, active_orders_amount: historyEntrust, orders_amount: bargain } = (await getAllAmount()).data
          const data = this.amountObj && JSON.parse(JSON.stringify(this.amountObj))
          const obj = {
            shipping: [this.calcBalanceList.length, data && data.shipping[0] !== this.calcBalanceList.length],
            shipped: [shipped, false],
            curEntrust: [curEntrust, data && data.curEntrust[0] !== curEntrust],
            lossEntrust: [lossEntrust, data && data.lossEntrust[0] !== lossEntrust],
            historyEntrust: [historyEntrust, data && data.historyEntrust[0] !== historyEntrust],
            bargain: [bargain, data && data.bargain[0] !== bargain]
          }
          obj[this.activeTableTabKey][1] = false
          this.amountObj = obj
          this.handleTableTabClick(this.activeTableTabKey)
          this.handleEntrustList()
          resolve()
        }, 100)
      })
    },

    matchFutureItemByKey(key) {
      if (!this.tickersData) return {}
      return this.tickersData.UNIT.find(item => item.pair === key)
    },
    async handleTableTabClick(key) {
      this.activeTableTabKey = key
      if (['curEntrust', 'shipping'].includes(key)) return
      this.tableList = null
      let data = (await this.mapHandlers[key]()).data
      data = Array.isArray(data) ? data : data.data
      this.tableList = data.map(item => {
        item.realized && (item.realized = this.bigRound(item.realized, 8))
        item.cancelBtnLoading = false
        if (item.symbol) {
          item._symbol = item.symbol
          item.symbol = key === 'shipped' ? this.$tR(`mapTabs.FUTURE_${item.symbol}`) : this.$tR(`mapTabs.${item.symbol}`)
        } else {
          item.symbol = this.$tR(`mapTabs.${item.name}`)
        }
        return item
      })

      // key === 'shipping' && (this.amountObj.shipping[0] = this.tableList.length)
      // const found = this.tableList.find(item => this.activeTabItem.pair.includes(item.currency))
      // this.activeLever = found && found.leverage || this.activeLever
      // this.holdingCount = found && found.holding || +this.holdingCount
      // this.take_rate = found && found.take_rate || +this.take_rate
    },
    matchClassByKey(key) {
      return ['current', 'change_24h', 'increment_24h'].includes(key) ? this.isBuy ? 'text-success' : 'text-danger' : ''
    },
    dataLoaded(lessPosition) {
      const element = this.$refs['content-wrap']
      if (!element) return setTimeout(() => this.dataLoaded(), 200)
      const centerEle = element.querySelector('.content-center') || {}
      element.scrollTop = (element.scrollHeight - element.clientHeight + (lessPosition ? centerEle.clientHeight || 64 : 64)) / 2
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
    handleSwitch(btnKey) {
      this.activeBtnsKey = btnKey
    },
    submitOrder(side) {
      // const product = this.activeProduct
      this.buyBtnLoading = true
      const data = {
        user_id: this.userData.id,
        amount: this.activeAcountAndPriceArr[0],
        price: this.activeAcountAndPriceArr[1] || this.activeProduct.UNIT.current,
        type: this.activeBtnsKey === '3' && this.activePriceType.key || this.activeBtnsKey, // 下单类型 1 限价 2市价 3限价止损 4市价止损 5限价止盈 6市价止盈
        side: this.side,
        name: this.activeProduct.name,
        leverage: this.activeLever,
        trigger_price: this.activeAcountAndPriceArr[2],
        trigger_type: this.trigger_type,
        trigger_close: this.trigger_close,
        passive: 0

        // tp_type 止盈触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
        // tp_price 止盈价格
        // sl_type 止损触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
        // sl_price 止损价格
      }
      return submitOrder(data).then(res => {
        this.handleAmountObj()
        setTimeout(() => {
          this.buyBtnLoading = false
          this.$message.success(this.$tR('handleSuccess'))
        }, 500)
      })
    },
    cancelOrder(data) {
      const { user_id, id, name } = data
      data.cancelBtnLoading = true
      cancelOrder({ user_id, order_id: id, name }).then(res => {
        this.handleAmountObj()
        setTimeout(() => {
          // this.cancelBtnLoading = false
          this.$message.success(this.$tR('handleSuccess'))
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
        margin-left:8px;
        margin-right:2.5%;
        line-height: 32px;
        font-size: 12px;
      }
      .info-list-box{
        flex-basis: 450px;
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
          &>li{
           &:nth-child(2n){
              background: #151927
            }
            &>span{
              position: relative;
              z-index: 1;
              &:hover{
                cursor: pointer;
                opacity: .8;
              }
            }
            margin: 1px 0;
            &>.mark-bg{
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
    .contrat-popper-class{
      background: #000;
    }
    &>.content-container-submit{
      padding:0 8px;
      line-height: 32px;
      text-align: left;
      &>*{
        margin-top: 12px;
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
        .activeBtn{
          box-shadow: 0 2px 0px 0px #fff;
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
  .information-content{
    padding: 12px;
    font-size: 12px;
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
</style>
