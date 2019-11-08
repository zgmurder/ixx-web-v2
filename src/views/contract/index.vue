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
              <span> {{ $tR(`mapDelegateList.new-bargain`) }}</span>
            </div>
            <div class="content-container-submit">
              <div flex="main:justify">
                <el-button v-for="(value,key) in mapBtns" :key="key" class="custom-btn" :class="{active:activeBtnsKey === key}" size="small" plain @click="handleSwitch(key)">{{ $tR(`mapFormContent.mapBtns.${key}`) }}</el-button>
              </div>
              <div flex="main:justify">
                <label for="">仓位</label>
                <input type="text" value="aaa">
                <span style="position:absolute;right:14px;color:#999">USD</span>
              </div>
              <div flex="main:justify">
                <label for="">价格</label>
                <input type="text" value="aaa">
                <span style="position:absolute;right:14px;color:#999">USD</span>
              </div>
              <div>
                <el-button type="success" style="width:100%">
                  <div flex="main:justify cross:center">
                    <span>买入/做多</span>
                    <span style="font-size:12px">@ 9103 USD</span>
                  </div>
                </el-button>
                <p style="font-size:12px;color:#999">成本：<span>--</span>BTC</p>
                <el-button type="danger" style="width:100%">
                  <div flex="main:justify cross:center">
                    <span>卖出/做空</span>
                    <span style="font-size:12px">@ 9103 USD</span>
                  </div>
                </el-button>
                <p style="font-size:12px;color:#999">成本：<span>--</span>BTC</p>
              </div>
              <div>
                <el-divider><svg-icon icon-class="share-down" /></el-divider>
                <div flex="main:justify">
                  <span>委托价值</span>
                  <span>0 BTC</span>
                </div>
                <div flex="main:justify">
                  <span>可用余额</span>
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
          <div class="hold-content">
            <div class="header" flex="main:justify">
              <span> 持有仓位 : BTC永续</span>
            </div>
            <div class="content-container-hold">
              <div flex="box:mean" style="text-align:center">
                <p>233 <br> 合约交易</p>
                <p>233 <br> 合约交易</p>
              </div>
              <div class="linear-bar" flex="main:justify cross:center">
                <svg-icon icon-class="btc" />
                <svg-icon icon-class="bug" />
                <div class="mark">{{ activeLeverKey }} x</div>
              </div>
              <div class="multiple-bar">
                <div class="dot-wrap" flex="main:justify box:mean">
                  <span>•</span>
                  <span v-for="value in mapLever" :key="value+'a'" :class="{'active':activeLeverKey === value,'text-active':activeLeverKey === value}" @click="activeLeverKey = value">•</span>
                  <span>•</span>
                </div>
                <hr>
                <div flex="main:justify box:mean">
                  <span>全仓</span>
                  <span v-for="value in mapLever" :key="value+'b'" :class="{'text-active':activeLeverKey === value}">{{ value }}</span>
                  <span>设置</span>
                </div>
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
          <div class="order-list">
            <div class="header" flex>
              <div v-for="(value,key) in mapTableTaps" :key="key" :class="{active:activeTableTabKey === key}" @click="handleTableTabClick(key)">
                <!-- <el-badge is-dot style="line-height:normal"> </el-badge> -->
                {{ $tR(`mapTableTaps.${key}`) }}
              </div>
            </div>
            <div class="order-list-content">
              <shipping v-if="activeTableTabKey && activeTableTabKey === 'shipping'" :data="tableList" />
              <customTable v-if="activeTableTabKey && activeTableTabKey !== 'shipping'" :table-list="tableList" :table-columns="tableColumns" @change="handlePageChange" />
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
import { bigRound, logogramNum, bigDiv, bigTimes, bigPlus, bigMinus } from '@/utils/handleNum'
import { getFutureListByKey, getSymbolList, getBalanceList, getClosedpositionList } from '@/api/contract'
import depthMap from './components/depth-map'
import shipping from './components/shipping'
import { mapLever } from '@/const'
import customTable from '@/components/customTable'
export default {
  name: 'Contract',
  components: {
    candlestick,
    selectBase,
    depthMap,
    customTable,
    shipping
  },
  filters: {
    bigRound
  },
  mixins: [soket],
  data() {
    return {
      mapLever,
      activeTabkey: '',
      activeBtnsKey: 'trading-volume',
      activeLeverKey: '',
      activeTableTabKey: 'shipping',
      isBuy: true,
      triggerBtn: false,
      dataDeep: '1',
      delegateData: null,
      newBargainListData: [],
      tickersData: null,
      products: [],
      websokets: [],
      tableList: null
    }
  },
  computed: {
    // mapTabs() {
    //   return this.chineseLangData.mapTabs
    // },
    mapDishInfo() {
      return this.chineseLangData.mapDishInfo
    },
    mapHeader1() {
      return this.chineseLangData.mapDelegateList.mapHeader1
    },
    mapHeader2() {
      return this.chineseLangData.mapDelegateList.mapHeader2
    },
    mapBtns() {
      return this.chineseLangData.mapFormContent.mapBtns
    },
    mapInformation() {
      return this.chineseLangData.mapInformation
    },
    mapTableTaps() {
      return this.chineseLangData.mapTableTaps
    },
    activeTabItem() {
      return this.matchFutureItemByKey(this.activeTabkey)
    },
    activeMarkItem() {
      return this.tickersData.MARKET.find(item => this.activeTabkey.includes(item.pair.split('_')[1]))
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
        curEntrust: '当前委托',
        lossEntrust: '止损委托',
        historyEntrust: '委托历史',
        bargain: '成交'
      }
    },
    tableColumns() {
      return [

      ]
    }
  },
  async created() {
    this.products = (await getSymbolList()).data
    await this.openWebSocket('/market/tickers', this.handleTickers)
    this.handleTabClick('FUTURE_BTCUSD')
    this.handleTableTabClick('shipping')
  },
  methods: {
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
      this.activeTableTabKey = key
      // this.temComponet = () => import(`./components/${key}.vue`)

      this.tableList = (await this.mapHandlers[key]()).data
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
        input{
          background: transparent;
          border: 1px solid #333;
          text-align: right;
          color: #ddd;
          box-sizing: border-box;
          width: 70%;
          padding-right: 58px;
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
        position: relative;
        margin-top: 20px;
        &>.dot-wrap{
          position: absolute;
          width: calc(100% + 4px);
          margin-top: -10px;
          margin-left:-2px;
          span{
            font-size: 30px;
            transition: transform .2s linear;
            &:hover,&.active{
              cursor: pointer;
              transform: scale(1.5)
            }
          }
        }
      }
    }
  }
  .order-list{
    &>.header{
      padding: 0;
      &>*{
        padding: 0 30px;
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
</style>
