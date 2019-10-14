<template>
  <div class="share-option" flex="main:justify cross:strech">
    <div class="share-option-bg" />

    <div class="left-side-bar">
      <div v-for="(value,key) in mapComponentNames" :key="key" :class="{active:drawerIsOpen && activeName === key}" @click="handleClickleftTab(key)">
        <svg-icon :icon-class="mapIcons[key]" style="font-size:24px" />
        <p>{{ value }}</p>
      </div>
    </div>
    <transition name="fade" @after-leave="afterLeaveOrEnter" @enter="afterLeaveOrEnter">
      <div v-if="drawerIsOpen" class="left-drawer">
        <div slot="title" flex="cross:center main:justify" style="height:40px">
          <p>最新价格<span class="share-text-info" style="font-size:12px;">(USDT/USD)</span></p>
        </div>
        <component :is="temComponet" :data="temComponet.name=== 'ShareHistory'?historyData:marketData" />
        <i class="el-icon-close" @click="drawerIsOpen = false" />
      </div>
    </transition>
    <div class="content" flex="dir:bottom">
      <charts-dynamic-update ref="dynamic-charts" style="width:100%" :income-obj="incomeObj" class="dynamic-update" @loadingData="showLoadBox" @handleTimeTabClick="handleTimeTabClick" @settleOrder="settleOrder" @pushData="data=>(marketData = data)" />
      <ul v-if="activeCurrencyProduct" class="time-tab" flex="main:justify cross:center box:mean">
        <li v-for="(item,index) in activeCurrencyProduct.periodList" :key="index" :class="{active:+activePeriod === +item.period}" @click="handleTimeTabClick(item.period)">{{ mapTabTimes[item.period] }}</li>
      </ul>
      <div style="position:absolute;top:20px;left:30px;z-index:14">
        <customSelect v-model="activeCurrencyProduct" size="small" label="symbol" :map-data="mapProduct" />
        <!-- <customSelect v-if="activeCurrencyProduct" v-model="activePeriodProduct" size="small" label="period" :map-data="activeCurrencyProduct.periodList" /> -->
      </div>
      <div v-if="!!loadingBoxWidth" v-loading="!!loadingBoxWidth" element-loading-background="rgba(0, 0, 0, 0.1)" style="position:absolute;top:10px;bottom:76px;left:30px;z-index:14" :style="{width:loadingBoxWidth+'px'}" />
    </div>
    <!-- <charts-dynamic-update class="content" /> -->
    <div class="right-side-bar">
      <div class="content-top hover-scale">
        <p class="share-text-info"> 投资 </p>
        <input v-model.number="orderCount" min="1" type="text" maxlength="8">
        <div class="btn-group">
          <div @click="orderCount++"> + </div>
          <div @click="orderCount>1 && orderCount--"> - </div>
        </div>
      </div>
      <div class="content-center hover-scale" flex="dir:top main:justify cross:center box:mean">
        <div flex="main:center cross:center" class="center-info">
          <div v-if="activeShareAccount" class="share-text-info">
            <!-- <span>{{ activeProductRate.up_rate|bigRound(2) }}%</span> -->
            <span>{{ activeShareAccount.up_rate|bigRound(2) }}%</span>
            <p><svg-icon icon-class="dollar" style="font-size:16px" /> {{ orderCount/100*(+activeShareAccount.up_rate)|bigRound(8) }}</p>
          </div>
        </div>
        <el-button class="center-btn success" :disabled="!$store.state.userData" type="success" @click="addLabels('green')" @mouseover.native="dynamicChart.activeHover('success')" @mouseout.native="dynamicChart.disableHover('success')">
          <svg-icon icon-class="share-up" style="font-size:40px" /> <h2 style="margin-top:5px">看涨</h2>
        </el-button>
      </div>
      <div class="content-center hover-scale" flex="dir:top main:justify cross:center box:mean">
        <el-button class="center-btn danger" :disabled="!$store.state.userData" type="danger" @click="addLabels('red')" @mouseover.native="dynamicChart.activeHover('danger')" @mouseout.native="dynamicChart.disableHover('danger')">
          <svg-icon icon-class="share-down" style="font-size:40px" /> <h2 style="margin-top:5px">看跌</h2>
        </el-button>
        <div flex="main:center cross:center" class="center-info">
          <div v-if="activeShareAccount" class="share-text-info">
            <span>{{ activeShareAccount.down_rate|bigRound(2) }}%</span>
            <p><svg-icon icon-class="dollar" style="font-size:16px" /> {{ orderCount/100*(+activeShareAccount.down_rate)|bigRound(8) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="marketData" ref="square-container" class="square-container" flex="dir:top box:mean">
      <div class="text">看涨 <br><span>{{ +marketData.Bullish }}%</span></div>
      <div class="mark-box" flex="dir:top box:mean">
        <div class="top" :style="{height:+marketData.Bullish+'%'}" />
        <div class="bottom" />
      </div>
      <div class="text"><span>{{ +marketData.Bearish }}%</span><br>看跌 </div>
    </div>
    <!-- <div class="test" style="margin-left:40px" />
    <div class="test" /> -->
  </div>
</template>
<script>
import chartsDynamicUpdate from './componets/dynamic-update'
import customSelect from '@/components/customSelect'
import websoketMixin from '@/mixins/soket'
import { createOrder, getHistory, getProduct } from '@/api/share_option'
import { deepCopy } from '@/utils'
import { bigMinus } from '@/utils/handleNum'
export default {
  name: 'ShareOption',
  components: {
    chartsDynamicUpdate,
    customSelect
  },
  mixins: [websoketMixin],
  data() {
    return {
      drawerIsOpen: false,
      activeName: '',
      temComponet: null,
      historyData: null,
      mapProduct: [],

      marketData: null,
      activePeriod: '',
      activeCurrencyProduct: null,
      activePeriodProduct: null,
      incomeObj: {},

      loadingBoxWidth: '',

      orderCount: 1
    }
  },
  computed: {
    mapComponentNames() {
      return {
        'spot-index': '现货指数',
        'history': '历史记录'
        // 'ranking-list': '排行榜',
        // 'teach-view': '教学视频'
      }
    },
    mapIcons() {
      return {
        'spot-index': 'chart',
        'history': 'history'
      }
    },
    dynamicChart() {
      return this.$refs['dynamic-charts']
    },
    mapTabTimes() {
      return ['1M', '5M', '10M', '1H', '3H', '1D', '7D']
    },
    userData() {
      return this.$store.state.userData
    },
    activeShareAccount() {
      return this.$store.state.activeShareAccount
    },
    mapShareAccount() {
      return this.$store.state.mapShareAccount
    }
  },
  watch: {
    activeCurrencyProduct: {
      handler(product) {
        this.activePeriodProduct = product.periodList[0]
        this.activePeriod = this.activePeriodProduct.period
        if (this.dynamicChart) {
          this.dynamicChart.switchProduct(product.symbol)
        }
        this.$store.dispatch('getShareAccountList', { accountArr: this.activePeriodProduct.currencyList })
      }
    }
  },
  created() {
    getProduct().then(res => {
      this.mapProduct = res.data
      this.activeCurrencyProduct = this.mapProduct[0]
    })
  },
  methods: {
    handleClickleftTab(name) {
      if (this.activeName === name && this.drawerIsOpen) return
      this.drawerIsOpen = true
      this.activeName = name
      this.temComponet = require(`./componets/${name}.vue`).default
      if (this.temComponet.name === 'ShareHistory') {
        this.getHistory()
      }
    },
    getHistory() {
      if (!this.userData) return
      const params = { user_id: this.userData.id, currency: this.activeShareAccount.currency }
      return getHistory(params).then(res => {
        this.historyData = res.data.data
        return Promise.resolve(res.data.data)
      })
    },
    afterLeaveOrEnter(el) {
      this.$refs['square-container'].style.left = el.clientWidth + 75 + 'px'
      this.dynamicChart.chart.reflow()
    },
    addLabels(color) {
      const tradeType = color === 'green' ? 0 : 1
      createOrder({ user_id: this.userData.id, symbol: this.activeCurrencyProduct.symbol, amount: this.orderCount, currency: this.activeShareAccount.currency, 'trade_type': tradeType, period: this.activePeriod }).then(res => {
        return this.$store.dispatch('getShareAccountList', { accountArr: this.activePeriodProduct.currencyList, isAssignment: true })
      }).then(res => {
        this.dynamicChart.addLabels(color, this.orderCount, this.activeShareAccount.currency)
        this.getHistory()
      })
    },
    handleTimeTabClick(period) {
      this.activePeriod = period
      this.dynamicChart.initChartsByReqType(+period)
    },
    settleOrder(callback) {
      setTimeout(() => {
        const mapShareAccount = deepCopy(this.mapShareAccount)
        this.$store.dispatch('getShareAccountList', { accountArr: this.activePeriodProduct.currencyList, isAssignment: true }).then(dataArr => {
          this.getHistory()
          const incomeObj = dataArr.reduce((prev, curr, index) => {
            prev[curr.currency] = bigMinus([curr.available, mapShareAccount[index].available], 4)
            return prev
          }, {})
          this.userData && callback && callback(incomeObj)
        })
      }, 300)
    },
    showLoadBox(width) {
      this.loadingBoxWidth = width
    }
  }
}
</script>
<style lang="scss" scoped="this api replaced by slot-scope in 2.5.0+">
.share-option{
  height: calc(100vh - 60px);
  box-sizing: border-box;
  font-size: 13px;
  background-image: url('./img/bj.png');
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  position: relative;
  .share-option-bg{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba($color: $--contract-table-bg, $alpha: .9);
    z-index: -1;
  }

  .left-side-bar{
    color: #6C7482;
    background: $--share-bg-color;
    width: 66px;
    text-align: center;
    border-right:1px solid $--share-border-color;
    line-height: 1.8;
    z-index: 4;
    &>div{
      padding: 10px 0;
      margin-bottom: 10px;
      &:hover{
        cursor: pointer;
      }
      &.active{
        background:#2C3343;
        color: #fff;
      }
    }
  }
  .left-drawer{
    width: 300px;
    background: $--share-bg-color;
    color: #D6DAE2;
    padding: 0 15px;
    border-right:1px solid $--share-border-color;
    position: relative;
    &>.el-icon-close{
      font-size: 26px;
      position: absolute;
      transition: all 0.5s ease;
      top: 10px;
      right: 10px;
      &:hover{
        transform: rotate(90deg);
        color: #fff;
        cursor: pointer
      }
    }
  }
  .content{
    position: relative;
    flex: 1;
    &>.dynamic-update{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 40px;
    };
    &>.time-tab{
      height: 34px;
      text-align: center;
      background: #363E4F;
      line-height: 34px;
      color: #999;
      &>li{
        &.active,&:hover{
          box-shadow: 0 2px 0 0 #fff inset;
          background: #4F596D;
          color: #fff;
          cursor: pointer;
        }
      }
  }
    // background: rgba$--share-bg-color;
  }
  .right-side-bar{
    width: 160px;
    box-sizing: border-box;
    padding: 10px;
    .hover-scale{
      transition: all .5s;
      &:hover{
         transform: scale(1.05)
      }
    }
    .content-top{
      // background: $--share-bg-color;
      background: rgba($color: #fff, $alpha: .1);
      border-radius: 4px;
      box-sizing: border-box;
      .share-text-info{
        line-height: 26px;
        text-indent: 6px;
      }
      input{
        background: transparent;
        border: none;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        letter-spacing: 1;
        outline: none;
        color: #fff;
        text-indent: 6px;
      }
      .btn-group{
        display: flex;
        border-top: 1px solid rgb(41, 48, 63);
        &>div{
          flex: 1;
          text-align: center;
          line-height: 30px;
          color: #fff;
          user-select:none;
          &:first-child{
            border-right:1px solid rgb(41, 48, 63);
            border-bottom-left-radius:4px;
          }
          &:last-child{
            border-bottom-right-radius: 4px;
          }
          &:hover{
            background:#2C3343;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
    .content-center{
      height: 200px;
      background: rgba($color: #fff, $alpha: .1);
      margin-top: 15px;
      border-radius: 6px;
      line-height: 26px;
      .center-info{
        width: 100%;
        text-align: center;
        &>.share-text-info{
          span{
            font-size: 20px;
            color: $--color-success
          }
        }
      }
      .center-btn{
        width:100%;
        box-sizing: border-box;
        padding: 0;
        border: none;
        &.success{
          border-top-left-radius:0;
          border-top-right-radius:0;
        }
        &.danger{
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }
      }
    }
  }
  .square-container{
    position: absolute;
    left:75px;
    top: 10px;
    bottom: 75px;
    opacity: .5;
    &>.text{
      flex: none;
      flex-basis: 40px;
      font-size: 12px;
      line-height: 20px;
      width: 26px;
      color: #ccc
    }
    &>.mark-box{
      &>.top{
        transition: all .5s ease-out;
        flex: none;
        border-top:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
        z-index: 0;
        position: relative;
        border-bottom:5px solid rgba($color: rgb(116, 116, 116), $alpha: .2);
        // border-left:13px solid rgba($color: red, $alpha: .8);
        border-right:13px solid rgba($color: green, $alpha: .6);
        transform: translate(-13px,5px);
        &::before{
          content: '';
          position: absolute;
          top: -5px;
          height: 100%;
          left: 26px;
          border-top:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
          border-bottom:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
          border-left:13px solid rgba($color: rgb(0, 36, 0), $alpha: .8);
          // transform: translateX(13px);
        }
      }
      &>.bottom{
        // height:0px;
        border-top:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
        z-index: -1;
        position: relative;
        border-bottom:5px solid rgba($color: rgb(116, 116, 116), $alpha: .6);
        // border-left:13px solid rgba($color: red, $alpha: .8);
        border-right:13px solid rgba($color: red, $alpha: .6);
        transform: translate(-13px,-5px);
        &::before{
          content: '';
          position: absolute;
          top: -5px;
          height: 100%;
          left: 26px;
          border-top:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
          border-bottom:5px solid rgba($color: rgb(0,0,0), $alpha: 0);
          border-left:13px solid rgba($color: rgb(68, 2, 2), $alpha: .6);
          // transform: translateX(13px);
        }
      }
      // &.bottom{
      //   // height:10px;
      //   position: relative;
      //   z-index: -1;
      //   border-top:5px solid rgba($color: rgb(116, 116, 116), $alpha: 0);
      //   border-bottom:0;
      //   border-left:13px solid rgba($color: green, $alpha: .8);
      //   border-right:13px solid rgba($color: rgb(0, 36, 0), $alpha: .8);
      //   // transform: translateY(-10px);
      // }
    }
  }
  .test{
    position: fixed;
    left: 40%;
    // width: 200px;
    height: 200px;
    border-left: 10px solid red;
    border-right: 10px solid green;
    border-top: 10px solid steelblue;
    border-bottom: 10px solid hotpink;
    transform: skewY(45deg);
  }
}
 /*添加动画效果*/
//  @keyframes rotateanimation{
//      0%{
//          transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
//      }
//      100%{
//          transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
//      }
//  }
</style>
