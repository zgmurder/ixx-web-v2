<template>
  <table class="table-container" border="1" cellspacing="0" cellpadding="0">
    <tbody>
      <tr>
        <td colspan="3">
          <div flex="main:left cross:strech" class="tabs-group">
            <div class="active" flex="cross:center">BTC永续<br>10316.5 </div>
            <div flex="cross:center">BTC永续<br>10316.5 </div>
            <div flex="cross:center">BTC永续<br>10316.5 </div>
          </div>
        </td>
        <td rowspan="7">111122222</td>
        <td rowspan="7">111122222</td>
        <td rowspan="10">111122222</td>
      </tr>
      <tr>
        <td colspan="3" rowspan="2">111122222</td>
      </tr><tr />
      <tr>
        <td colspan="3" rowspan="7"><candlestick /></td>
      </tr><tr /><tr /><tr />
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
<style lang="scss">
.table-container{
  width: 100%;
  table-layout: fixed;
  background: #0c1222;
  color: #d7d7d7;
  box-sizing: border-box;
  border-collapse: collapse;
  text-align: center;
  height: calc(100vh - 60px);
  overflow: hidden;
  tr{
    height: 50px;
  }
  td{
    border-width:4px;
    border: solid 4px #272837;
    &>div{
      width:100%;
      height: 100%;
      line-height: 1.4
    }
    .tabs-group > div{
      padding: 0 20px;
      margin-right:5px;
      &:hover{
        background: #1D1D1D;
        cursor: pointer;
      }
      &.active{
        background: #1D1D1D;
      }
    }
  }
}

</style>
