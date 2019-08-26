<template>
  <div class="home">
    <!-----------------------------------------------home-banner---------------------------------------------------------->
    <div flex="dir:bottom" class="home-banner" :style="{background:bgUrl}">
      <el-carousel class="container carousel-container" style="height:auto" trigger="click" height="126px">
        <el-carousel-item>
          <div flex="main:justify">
            <img src="@/assets/banner1-1.jpg" alt="">
            <img src="@/assets/banner1-2.jpg" alt="">
            <img src="@/assets/banner1-3.jpg" alt="">
            <img src="@/assets/banner1-4.jpg" alt="">
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <img src="@/assets/banner2.jpg" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-----------------------------------------------home-content---------------------------------------------------------->
    <div class="home-content">
      <div class="content-top">
        <div class="form-container" flex="main:justify cross:center">
          <div class="form-label">
            <span class="title">一键买币</span><br>
            <em>参考单价7.03 CNY/USDT</em>
          </div>
          <el-input style="width:265px;margin:0 10px" />
          <el-button style="flex:1">USDT</el-button>
          <el-button style="flex:1" type="success">一键买币</el-button>
        </div>
        <hr>
        <div class="tip-container container" flex="main:justify cross:center">
          <p class="tips-text">[7-14]关于IXX.com开放ADA交易市场的公告</p>
          <p class="tips-text">[7-12]关于IXX.com开放BHD永续合约市场的公告</p>
          <p>一堆文字</p>
        </div>
      </div>
      <div class="content-center container">
        <div class="list-container" flex="main:justify">
          <character-list v-for="(item,index) in 5" :key="index" :data="item" />
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import characterList from '@/components/characterList'
export default {
  name: 'Home',
  components: {
    characterList
  },
  data() {
    return {
      bgUrl: `url(${require('@/assets/ixx_bg.png')})`,
      totalMoney: '',
      currensyList: [
        {
          change_24h: '2.6156',
          current: '10377',
          highest_24h: '10516',
          highest_bid: '10376.5',
          highest_bid_amount: '181394',
          increment_24h: '264.5',
          lowest_24h: '10090',
          lowest_ask: '10377',
          lowest_ask_amount: '380476',
          pair: 'FUTURE_BTCUSD',
          time: 1566193485412,
          volume_24h: '842580189',
          volume_current: '7760'
        }
      ],
      activeName: 'first'
    }
  },
  created() {
    // TradingView.onready(function() {
    //   console.log(111)
    // })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss">
.home{
  .home-banner{
    height: 400px;
    .carousel-container{
      height:auto;
    }
  }
  .home-content{
    .content-top{
      background: #262626;
      .form-container{
        width: 800px;
        height: 80px;
        margin: 0 auto;
        // padding: 15px;
        .form-label{
          text-align: center;
          font-size: 12px;
          color: $--color-primary;
          .title{
            font-size: 18px;
            line-height: 30px;
            color: #fff
          }
        }

      }
      .tip-container{
        height: 60px;
        // padding-right: 60px;
        .tips-text{
          font-size: 12px
        }
      }
    }
    .content-center{
      .list-container{
        margin:20px 0;
      }
    }
  }
}
</style>
