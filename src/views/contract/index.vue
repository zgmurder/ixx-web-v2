<template>
  <table class="table-container" border="1" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td colspan="3">
          <div
            v-loading="!tickersData" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)" style="height:100%"
          >
            <div v-if="tickersData" flex="main:left cross:strech" class="tabs-group">
              <div v-for="(value,key) in mapTabs" :key="key" :class="{active:activeTabkey === key}" flex="dir:top main:center" @click="handleTabClick(key)">
                <p>{{ $tR(`mapTabs.${key}`) }}</p>
                <span
                  :class="[(key === 'BTC'?isBuy:matchItemByKey(key).increment_24h > 0)?'is-success':'is-danger']"
                >{{ matchItemByKey(key).current | bigRound(matchItemByKey(key).dictionary.price_scale) }}
                  <svg-icon :icon-class="(key === 'BTC'?isBuy:matchItemByKey(key).increment_24h > 0)?'up':'down'" /></span>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div
            v-loading="!delegateData"
            class="delegate-list"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
            style="height:100%"
          >
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
                    <span class="is-danger">{{ item.values[0] | bigRound(activeTabItem.dictionary.price_scale) }}</span>
                    <span style="flex:1">{{ item.values[1] | bigRound(0) }}</span>
                    <span>{{ item.values[2] }}</span>
                    <div class="mark-bg is-buy" :style="{width:handleWidthBg(item.values[1],asks.max)}" />
                  </li>
                </ul>
                <div class="content-center">
                  <p :class="[(activeTabkey === 'BTC'?isBuy:activeTabItem.increment_24h > 0)?'is-success':'is-danger',triggerBtn && 'justify'||'']">
                    <span>
                      {{ activeTabItem.current | bigRound(activeTabItem.dictionary.price_scale) }}
                      <svg-icon :icon-class="(activeTabkey === 'BTC'?isBuy:activeTabItem.increment_24h > 0)?'up':'down'" />
                    </span>
                    <el-link v-if="triggerBtn" :underline="false" type="info" @click="dataLoaded(true)">{{ $tR(`mapDelegateList.return-dish`) }}</el-link>
                  </p>
                  <p v-show="!triggerBtn">{{ activeIndexItem.current }} / {{ handleDishInfoItem('markPrice') }}</p>
                </div>
                <ul>
                  <li v-for="(item,index) in bids.arr" :key="index" flex="main:justify cross:center">
                    <span class="is-success">{{ item.values[0] | bigRound(activeTabItem.dictionary.price_scale) }}</span>
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
          <div
            v-loading="!newBargainListData.length"
            class="delegate-list"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
          >
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
                    <span :class="[item.side === 'buy'?'is-success':'is-danger']">{{ $tR(item.side) }}</span>
                    <span :class="[item.side === 'buy'?'is-success':'is-danger']">{{ item.values[0]|bigRound(activeTabItem.dictionary.price_scale) }}</span>
                    <span>{{ item.values[1] }}</span>
                    <span>{{ item.time | parseTime('{h}:{i}:{s}') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="10">111122222</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="1">
          <div
            v-loading="!tickersData"
            class="dish-info" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
          >
            <template v-if="tickersData">
              <div class="info-left">
                <div class="title">
                  <svg-icon icon-class="round" class="round" />
                  {{ $tR(`mapTabs.${activeTabkey}`) }}
                  <svg-icon
                    :class="[isMatchBuy?'is-success':'is-danger']"
                    :icon-class="isMatchBuy?'up':'down'"
                  />
                </div>
                <span>资金费率： </span>
                <span>  0.0082 %
                  <el-tooltip content="Global Size" effect="dark" placement="bottom">
                    <i class="el-icon-caret-bottom" />
                  </el-tooltip>
                </span>
              </div>
              <div class="info-list-box">
                <div v-for="(value,key) in mapDishInfo" :key="key">{{ $tR(`mapDishInfo.${key}`) }}： <span :class="[matchClassByKey(key)]">{{ handleDishInfoItem(key) }}{{ key === 'change_24h' && '%' ||'' }}</span></div>
                <div>≈ {{ activeTotalToBTC }} BTC</div>
              </div>
            </template>

            <div class="calculator"><i class="el-icon-caret-bottom" />计算器</div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="8">
          <candlestick />
        </td>
      </tr><tr /><tr /><tr /><tr />
      <tr>
        <td rowspan="3" colspan="2" />
      </tr><tr /><tr />
      <tr>
        <td rowspan="3" colspan="5" />
        <td rowspan="3" />
      </tr><tr /><tr />
    </tbody>
  </table>
</template>

<script>
import candlestick from '@/components/candlestick'
import selectBase from '@/components/selectBase'
import soket from './soket'
import { bigRound, logogramNum, bigDiv, bigTimes, bigPlus } from '@/utils/handleNum'
import { getFutureListByKey } from '@/api/contract'
// import PackWebSoket from './packWebSoket'
export default {
  name: 'Contract',
  components: {
    candlestick,
    selectBase
  },
  filters: {
    bigRound
  },
  mixins: [soket],
  data() {
    return {
      activeTabkey: '',
      isBuy: true,
      triggerBtn: false,
      dataDeep: '1',

      delegateData: null,
      dataDictionary: [],
      newBargainListData: []
    }
  },
  computed: {
    mapTabs() {
      return this.chineseLangData.mapTabs
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
    activeTabItem() {
      return this.matchItemByKey(this.activeTabkey)
    },
    activeMarkItem() {
      if (!this.tickersData) return {}
      return this.tickersData.MARKET.find(item => item.pair.includes(this.activeTabkey))
    },
    activeIndexItem() {
      if (!this.tickersData) return {}
      return this.tickersData.INDEX.find(item => item.pair.includes(this.activeTabkey))
    },
    activeTotalToBTC() {
      const arr = [this.activeTabItem.volume_24h, this.activeTabItem.current]
      return this.activeTabkey === 'BTC' ? bigDiv(arr) : bigTimes([...arr, this.activeTabItem.dictionary.multiplier])
    },
    isMatchBuy() {
      return this.activeTabkey === 'BTC' ? this.isBuy : this.activeTabItem.increment_24h > 0
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
    }
  },
  created() {
    this.$eventBus.$emit('TradingViewOnready')
    this.$once('baseDataLoaded', () => this.handleTabClick('BTC'))
  },
  methods: {
    matchItemByKey(key) {
      if (!this.tickersData) return {}
      return this.tickersData.FUTURE.find(item => item.pair.includes(key))
    },
    handleDishInfoItem(key) {
      const price_scale = this.activeTabItem.dictionary.price_scale
      if (key === 'markPrice') {
        const fixed = this.activeTabkey === 'BTC' ? 2 : price_scale
        return bigRound(this.activeMarkItem.current, fixed)
      } else {
        const fixed = key === 'change_24h' ? 2 : price_scale
        const unit = this.activeTabkey === 'BTC' ? 'USD' : this.$tR(`sheet`)
        return key === 'volume_24h' ? logogramNum(this.activeTabItem[key]) + unit : bigRound(this.activeTabItem[key], fixed)
      }
    },
    handleTabClick(key) {
      if (this.activeTabkey === key) return
      this.delegateData = null
      this.newBargainListData = []
      if (this.activeTabkey) {
        this.closeWebSocket(`/orderbook/FUTURE_${this.activeTabkey}USD/0/1/20`)
        this.closeWebSocket(`/deal/FUTURE_${this.activeTabkey}USD`)
      }
      this.openWebSocket(`/orderbook/FUTURE_${key}USD/0/1/20`, data => (this.delegateData = data)).then(() => this.$nextTick(() => this.dataLoaded()))
      getFutureListByKey(key, { size: 16 }).then(res => (this.newBargainListData = res.data)).then(res => {
        this.openWebSocket(`/deal/FUTURE_${key}USD`, data => {
          const last = data[data.length - 1]
          this.newBargainListData.length = this.newBargainListData.length - 1
          this.newBargainListData.unshift(last)
          this.isBuy = last.side === 'buy'
        })
      })
      this.activeTabkey = key
    },
    matchClassByKey(key) {
      return ['current', 'change_24h', 'increment_24h'].includes(key) ? this.isMatchBuy ? 'is-success' : 'is-danger' : ''
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
    }
  }
}
</script>
<style lang="scss" scoped>
.is-danger{
  color: $--color-danger
}
.is-success{
  color: $--color-success
}
.table-container{
  .tabs-group,.dish-info,.delegate-list{
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
