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
            v-loading="!delegateData" class="delegate-list"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)"
            style="height:100%"
          >
            <div class="header" flex="main:justify">
              <span> 委托列表 </span>
              <span> 委托列表 </span>
            </div>
            <div class="content-header" flex="main:justify">
              <span>数量</span>
              <span>数量</span>
              <span>数量</span>
            </div>
            <div ref="content-wrap" class="content-wrap">
              <div v-if="delegateData" class="content-container">
                <ul>
                  <li v-for="(item,index) in delegateData.asks" :key="index" flex="main:justify cross:center">
                    <span class="is-danger">{{ item.values[0] | bigRound }}</span>
                    <span style="flex-basis:50px">{{ item.values[1] | bigRound(0) }}</span>
                    <span>10307.01</span>
                  </li>
                </ul>
                <div class="content-center">
                  <p
                    :class="[(activeTabkey === 'BTC'?isBuy:activeTabItem.increment_24h > 0)?'is-success':'is-danger']"
                  >{{ activeTabItem.current | bigRound(activeTabItem.dictionary.price_scale) }}
                    <svg-icon :icon-class="(activeTabkey === 'BTC'?isBuy:activeTabItem.increment_24h > 0)?'up':'down'" /></p>
                  <p>10342.0 / 10342.0</p>
                </div>
                <ul>
                  <li v-for="(item,index) in delegateData.bids" :key="index" flex="main:justify cross:center">
                    <span class="is-success">{{ item.values[0] | bigRound }}</span>
                    <span style="flex-basis:50px">{{ item.values[1] | bigRound(0) }}</span>
                    <span>10307.01</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">
          <div class="delegate-list">
            <div class="header" flex="main:justify">
              <span> 委托列表 </span>
              <span> 委托列表 </span>
            </div>
            <div class="content-header" flex="main:justify">
              <span>数量</span>
              <span>数量</span>
              <span>数量</span>
            </div>
            <div class="content-wrap">
              <div class="content-container">
                <ul>
                  <li v-for="index in 26" :key="index" flex="main:justify cross:center">
                    <span>10307.01</span>
                    <span>10307.01</span>
                    <span>10307.01</span>
                    <span>10307.01</span>
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
          <!-- <candlestick /> -->
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
import soket from './soket'
import { bigRound, logogramNum, bigDiv, bigTimes } from '@/utils/handleNum'
// import PackWebSoket from './packWebSoket'
export default {
  name: 'Contract',
  components: {
    candlestick
  },
  filters: {
    bigRound
  },
  mixins: [soket],
  data() {
    return {
      activeTabkey: '',
      isBuy: true
    }
  },
  computed: {
    mapTabs() {
      return this.chineseLangData.mapTabs
    },
    mapDishInfo() {
      return this.chineseLangData.mapDishInfo
    },
    activeTabItem() {
      return this.matchItemByKey(this.activeTabkey)
    },
    activeMarkItem() {
      if (!this.tickersData) return {}
      return this.tickersData.MARKET.find(item => item.pair.includes(this.activeTabkey))
    },
    activeTotalToBTC() {
      const arr = [this.activeTabItem.volume_24h, this.activeTabItem.current]
      return this.activeTabkey === 'BTC' ? bigDiv(arr) : bigTimes([...arr, this.activeTabItem.dictionary.multiplier])
    },
    isMatchBuy() {
      return this.activeTabkey === 'BTC' ? this.isBuy : this.activeTabItem.increment_24h > 0
    }
  },
  created() {
    this.$eventBus.$emit('TradingViewOnready')
    this.handleTabClick('BTC')
    this.$once('dataLoaded', this.dataLoaded)
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
        return key === 'volume_24h' ? logogramNum(this.activeTabItem[key]) : bigRound(this.activeTabItem[key], fixed)
      }
    },
    handleTabClick(key) {
      if (this.activeTabkey === key) return
      this.activeTabkey = key
      const wsurl = `${process.env.VUE_APP_WS_API}deal/FUTURE_${key}USD`
      new WebSocket(wsurl).onmessage = e => {
        const res = JSON.parse(e.data)
        if (res.code === 0) {
          this.isBuy = res.data[res.data.length - 1].side === 'buy'
        }
      }
    },
    matchClassByKey(key) {
      return ['current', 'change_24h', 'increment_24h'].includes(key) ? this.isMatchBuy ? 'is-success' : 'is-danger' : ''
    },
    dataLoaded() {
      const element = this.$refs['content-wrap']
      element.scrollTop = (element.scrollHeight - element.clientHeight) / 2
    }
  }
}
</script>
<style lang="scss" scope>
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
          flex-basis: 140px;
        }
      }
  }

  .delegate-list{
    .content-header{
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border-bottom: 1px solid #333;
    };

    &>.content-wrap{
      position: absolute;
      width: 100%;
      height: calc(100% - 64px);
      overflow-y:scroll;

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
        }
        &>ul{
          padding: 0 10px;
          text-align: right
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
