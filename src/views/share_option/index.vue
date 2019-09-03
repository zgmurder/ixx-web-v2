<template>
  <div class="share-option" flex="main:justify cross:strech">
    <div class="share-option-bg" />
    <div class="left-side-bar">
      <div v-for="(value,key) in mapComponentNames" :key="key" :class="{active:drawerIsOpen && activeName === key}" @click="handleClickTab(key)">
        <svg-icon icon-class="chart" style="font-size:24px" />
        <p>{{ value }}</p>
      </div>
    </div>
    <transition name="fade">
      <div v-if="drawerIsOpen" class="left-drawer">
        <div slot="title" flex="cross:center main:justify" style="height:40px">
          <p>最新价格<span class="share-text-info" style="font-size:12px;">(USDT/USD)</span></p>
        </div>
        <component :is="temComponet" />
        <i class="el-icon-close" @click="drawerIsOpen = false" />
      </div>
    </transition>
    <div class="content" box="mean">
      <charts-dynamic-update />
    </div>
    <div class="right-side-bar">
      <div class="content-top hover-scale">
        <p class="share-text-info"> 投资 </p>
        <input type="text" maxlength="8" value="10000">
        <div class="btn-group">
          <div> + </div>
          <div> - </div>
        </div>
      </div>
      <div class="content-center hover-scale" flex="dir:top main:justify cross:center box:mean">
        <div flex="main:center cross:center" class="center-info">
          <div class="share-text-info">
            <span>+70.16%</span>
            <p><svg-icon icon-class="clipboard" />0.71</p>
          </div>
        </div>
        <el-button class="center-btn success" :disabled="false" type="success">成功按钮</el-button>
      </div>
      <div class="content-center hover-scale" flex="dir:top main:justify cross:center box:mean">
        <el-button class="center-btn danger" :disabled="false" type="danger">成功按钮</el-button>
        <div flex="main:center cross:center" class="center-info">
          <div class="share-text-info">
            <span>+70.16%</span>
            <p><svg-icon icon-class="clipboard" />0.71</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chartsDynamicUpdate from './componets/dynamic-update'
export default {
  name: 'ShareOption',
  components: {
    chartsDynamicUpdate
  },
  data() {
    return {
      drawerIsOpen: false,
      activeName: '',
      temComponet: null
    }
  },
  computed: {
    mapComponentNames() {
      return {
        'spot-index': '现货指数',
        'history': '历史记录',
        'ranking-list': '排行榜',
        'teach-view': '教学视频'
      }
    }
  },
  methods: {
    async handleClickTab(name) {
      if (this.activeName === name && this.drawerIsOpen) return
      this.drawerIsOpen = true
      this.activeName = name
      this.temComponet = require(`./componets/${name}.vue`).default
    }
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
.share-option{
  height: calc(100vh - 60px);
  box-sizing: border-box;
  font-size: 13px;
  background: url('./bg-chart.png') no-repeat center bottom;
  background-size: 100%;
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
    z-index: 1;
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
    flex: 1;

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
      background: rgba($color: $--contract-table-bg, $alpha: .6);
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
      background: rgba($color: $--contract-table-bg, $alpha: .6);
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
}

</style>
