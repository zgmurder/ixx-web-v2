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
          <p class="text-success">{{ key === 'markPrice'?markData[item.currency]:item[key] }}</p>
          <!-- <p class="interval">止盈/止损</p>
          <p>-- / -- </p> -->
        </div>
      </div>
      <div>
        <p class="text-active">平仓价格</p>
        <p v-if="item.holding > 0" class="text-success">{{ $t(`contract.mapFormContent.mapHandleBtn.buy`) }}</p>
        <p v-else class="text-danger">{{ $t(`contract.mapFormContent.mapHandleBtn.sell`) }}</p>
        <div class="interval">
          <el-button size="mini" type="danger" round>{{ $tR(`price`) }}</el-button>
          <el-button size="mini" type="success" round>{{ $tR(`closeOut`) }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bigDiv } from '@/utils/handleNum'
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
