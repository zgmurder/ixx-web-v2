<template>
  <table class="table-container" border="1" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td colspan="3">
          <div flex="main:left cross:strech" class="tabs-group">
            <div class="active" flex="cross:center">BTC永续<br>10316.5 </div>
            <div flex="cross:center">BTC永续<br>10316.5 </div>
            <div flex="cross:center">BTC永续<br>10316.5 </div>
            <div flex="cross:center">BTC永续<br>10316.5 </div>
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
                  </li>
                </ul>
                <div class="content-center">
                  <p>10342.0</p>
                  <p>10342.0/10342.0</p>
                </div>
                <ul>
                  <li v-for="index in 26" :key="index" flex="main:justify cross:center">
                    <span>10307.01</span>
                    <span>10307.01</span>
                    <span>10307.01</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </td>
        <td rowspan="7">111122222</td>
        <td rowspan="10">111122222</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="1">
          <div class="dish-info">
            <div>
              <div class="title">BTC永续</div>
              <span>资金费率： </span>
              <span>  0.0082 %
                <el-tooltip content="Global Size" effect="dark" placement="bottom">
                  <i class="el-icon-caret-bottom" />
                </el-tooltip>
              </span>
            </div>
            <div>最新价： <span>10342.0</span><br>最新价： <span>10342.0</span></div>
            <div>最新价： <span>10342.0</span><br>最新价： <span>10342.0</span></div>
            <div>最新价： <span>10342.0</span><br>最新价： <span>10342.0</span></div>
            <div class="calculator"><i class="el-icon-caret-bottom" />计算器</div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="8"><candlestick /></td>
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
export default {
  name: 'Contract',
  components: {
    candlestick
  },
  created() {
    this.$eventBus.$emit('TradingViewOnready', '2433')
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
::-webkit-scrollbar {
    display: none;
    width: 0px;
    height: 10px;
  }
::-webkit-scrollbar-thumb {
  background: $--contract-table-bg;
  border: none;
}
.table-container{
  .tabs-group,.dish-info,.delegate-list{
    box-sizing: border-box;
      width:100%;
      height: 100%;
      line-height: 1.4;
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
      padding: 0 20px;
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
      line-height: 32px;
      position: relative;
      & > div{
        margin-left: 30px;
        &:not(:first-child){
          font-size: 12px;
        }
      }
      & .title{
        border: 1px solid $--color-primary;
        border-radius: 4px;
        text-align: center;
      }
      & >div.calculator{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 16px;
      }
  }

  .delegate-list{
    .content-header{
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
    };

    &>.content-wrap{
      position: absolute;
      width: 100%;
      height: calc(100% - 64px);
      overflow-y:scroll;
      &>.content-container{
        position: absolute;
        width: 100%;
        &>.content-center{
          position: sticky;
          line-height: 32px;
          top: 0;
          bottom: 0;
          background: $--contract-table-active;
          margin: 10px 0
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
