<template>
  <div>
    <table class="table-container" border="1" cellspacing="0" cellpadding="0">
      <tr class="tr-1">
        <td class="grid-pair-title">
          <label>{{ currentProduct.product_name + "/" + currentProduct.currency_name }}</label>
          <span>
            {{ currentProduct.price }} ,
          </span>
          <span>
            涨跌幅  {{ currentProduct.delta | toFixed(2) }} %,
          </span>
          <span>
            高  {{ pairTick.highest_24h | toFixed(2) }},
          </span>
          <span>
            低 {{ pairTick.lowest_24h | toFixed(2) }},
          </span>
          <span>
            24H 量  {{ pairTick.volume_24h | toFixed(2) }} {{ currentProduct.product_name }}
          </span>
        </td>
        <td class="grid-order-book" rowspan="2">
          <orderbook />
        </td>
        <td class="grid-deal" rowspan="2">最新成交</td>
      </tr>
      <tr>
        <td class="grid-trading-view" rowspan="2">
          k线
        </td>
      </tr>
      <tr>
        <td class="grid-operate" colspan="2">
          操作区
        </td>
      </tr>
      <tr>
        <td class="grid-order" colspan="3">
          委托记录
        </td>
      </tr>
      <tr>
        <td class="grid-intro" colspan="3">
          币种资料
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { getRates, getPairList, getBalanceList } from '@/api/trading'
import { toBig, bigTimes, bigMinus, bigDiv } from '@/utils/handleNum'
import orderbook from './components/Orderbook'
import soket from '../../mixins/soket'

export default {
  name: 'Trading',
  components: { orderbook },
  mixins: [soket],
  data() {
    return {
      pair: '',
      products: [],
      currentProduct: {},
      tickersData: null,
      pairTick: {}
    }
  },
  async created() {
    console.log(1111)
    const res = await getPairList()
    if (res.code === 200 && res.data) {
      res.data = res.data.map(item => {
        item.amount_scale = parseInt(item.amount_scale, 10)
        item.currency_scale = parseInt(item.price_scale, 10)
        item.price_scale = parseInt(item.price_scale, 10)
        item.product_name = item.product
        item.currency_name = item.currency
        return item
      })

      this.products = res.data
      if (this.products.length > 0) {
        this.current_product = this.products[0]
        this.pair = this.products[0].name
        this.currentProduct = this.products[0]
      }
    }

    await this.openWebSocket('/market/tickers', this.handleTickers)
  },
  methods: {
    load() {
      // console.log(1111)
    },
    handleTickers(data) {
      const dictionary = [...this.products]
      const dataArr = data
      dataArr.forEach(item => {
        this.patch(item)
      })
    },
    patch(item) {
      console.log('')
      const find = this.products.find(pair => pair.name === item.pair)
      if (find) {
        find.price = item.current
        find.delta = bigDiv([bigTimes([item.increment_24h, 100], 10), bigMinus([item.current, item.increment_24h], 10)], 10)

        find.vol = item.volume_24h
        find.tick = item
      }
      if (this.pair === item.pair) {
        this.pairTick = item
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  .grid-pair-title {
    min-width: 760px;
    height: 30px;
  }
  .grid-order-book {
    height: 320px;
    width: 288px;
  }
  .grid-deal {
    width: 292px;
  }
  .grid-trading-view {
    width: 292px;
    height: 574px;
  }
  .grid-operate {
    height: 288px;
    width: 604px;
  }
  .grid-order {
    height: 290px;
  }
  .grid-intro {
    height: 290px;
  }
}
table.table-container{
  width: 100%;
  table-layout: fixed;
  background:$--trading-table-bg;
  color: #d7d7d7;
  box-sizing: border-box;
  border-collapse: collapse;
  text-align: center;
  height: calc(100vh - 60px);
  overflow: hidden;
  font-size: 14px;
  tr{
    // height: 50px;
    td{
      border-width:4px;
      border: solid 4px $--trading-table-bd;
    }
  }
}
</style>
