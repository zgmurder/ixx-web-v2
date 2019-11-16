<template>
  <div class="shipping">
    <div v-for="item in data" :key="item.currency" class="shipping-item" flex>
      <div>
        <h2 class="text-active">{{ $t(`contract.mapTabs.FUTURE_${item.currency}`) }}</h2>
        <h3 v-if="item.holding > 0" class="text-success">{{ $t(`contract.mapFormContent.mapHandleBtn.buy`) }}</h3>
        <h3 v-else class="text-danger">{{ $t(`contract.mapFormContent.mapHandleBtn.sell`) }}</h3>
        <p class="interval">{{ $tR('lossLimit') }} / {{ $tR('winLimit') }}</p>
        <p>-- / -- </p>
      </div>
      <div flex>
        <div v-for="(value,key,i) in tableColumns" :key="key">
          <p class="text-info" :class="{interval:i>4}">{{ $t(`contract.mapTableTapContents.shipping.mapTableColumns.${key}`) }}</p>
          <p v-if="i<5" class="text-success">{{ key === 'markPrice'?markData[item.currency]:item[key] }}</p>
          <p v-else class="text-success">{{ item[key]|bigRound(8) }}</p>
          <p v-if="i>4">≈ {{ translateByRate(item[key])|bigRound(2) }} USD </p>
        </div>
      </div>
      <div flex="dir:top cross:center main:justify">
        <!-- <p class="text-active">平仓价格</p>
        <p v-if="item.holding > 0" class="text-success">{{ $t(`contract.mapFormContent.mapHandleBtn.buy`) }}</p>
        <p v-else class="text-danger">{{ $t(`contract.mapFormContent.mapHandleBtn.sell`) }}</p>
        <div class="interval">
          <el-button size="mini" type="danger" round>{{ $tR(`price`) }}</el-button>
          <el-button size="mini" type="success" round>{{ $tR(`closeOut`) }}</el-button>
        </div> -->

        <el-popover v-model="visible" placement="top" width="160">
          <p>确定要以 <span class="text-danger">市价【{{ $t(`contract.mapFormContent.perfactPrice`) }}】</span>平掉所有持仓吗</p>
          <hr>
          <div flex="main:justify cross:center">
            <!-- <el-button size="mini" type="text" @click="visible = false">取消</el-button> -->
            <el-checkbox v-model="visibleChecked">不在提示</el-checkbox>
            <el-button type="primary" size="mini" @click="closeStorehouse(item,true)">确定</el-button>
          </div>
          <el-button slot="reference" type="primary">市价平仓</el-button>
        </el-popover>
        <div />
        <el-popover v-model="visible1" placement="top" width="160">
          <el-input v-model="input" size="small" placeholder="请输入平仓价格" />
          <p style="margin-top:5px">确定到<span class="text-danger">指定价格</span>后平掉所有持仓吗</p>
          <hr>
          <div flex="main:justify cross:center">
            <!-- <el-button size="mini" type="text" @click="visible = false">取消</el-button> -->
            <el-checkbox v-model="visibleChecked">不在提示</el-checkbox>
            <el-button type="primary" size="mini" :disabled="!input" @click="closeStorehouse(item)">确定</el-button>
          </div>
          <el-button slot="reference" type="primary" plain>限价平仓</el-button>
        </el-popover>
      </div>
    </div>
    <span v-if="data && data.length === 0" class="el-table__empty-text">{{ $t('el.table.emptyText') }}</span>
  </div>
</template>
<script>
import { bigDiv, bigTimes } from '@/utils/handleNum'
import { getRates, closeStorehouse } from '@/api/contract'
export default {
  name: 'Shipping',
  props: {
    data: {
      type: Array,
      default: null
    },
    tableColumns: {
      type: Object,
      default: null
    },
    markData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currencyRates: null,
      visible: false,
      visible1: false,
      visibleChecked: false,
      input: ''
    }
  },
  async created() {
    this.currencyRates = (await getRates({ currency: 'BTC' })).data.BTC
  },
  methods: {
    handleValueByKey(key, item) {
      switch (key) {
        case 'markPrice':
          return this.markData[item.currency]
        case 'value':
          return bigDiv([item.holding, item.price])
        default:
          return item[key]
      }
    },
    translateByRate(value) {
      if (!this.currencyRates) return
      return bigTimes([this.currencyRates['USD'], value])
    },
    closeStorehouse(item, isMarket) {
      const params = { symbol: 'FUTURE_' + item.currency, price: isMarket ? '0' : this.input }
      closeStorehouse(params).then(res => {
        this.$message.success(this.$t('handleSuccess'))
      })
      this.visible = false
      this.visible1 = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .shipping{
    min-height: 100%;
    .shipping-item{
      padding: 12px;
      border-bottom: 1px solid #222;
      &>div{
        .interval{
          margin-top: 15px;
        }
        &:first-child{
          margin-right: 50px;
          padding-right:50px;
          border-right: 1px dashed #333;
        }
        &:nth-child(2){
          flex: 1;
          text-align: left;
          flex-wrap: wrap;
          font-size: 12px;
          &>div{
            width: 20%
          }
        }
        &:last-child{
          margin-left: 50px;
          padding-left:50px;
          border-left: 1px dashed #333;
        }
      }
    }
  }
</style>
