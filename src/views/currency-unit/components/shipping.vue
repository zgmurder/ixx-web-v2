<template>
  <div class="shipping">
    <!--
        v-loading="!!item.future_close_id"
        element-loading-text="系统正在以市价【市场最优价格】为你的【ETH币本位】平仓，请耐心等待..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" -->
    <div v-for="item in data" :key="item.currency" class="shipping-item" flex>
      <div>
        <h2 class="text-active">{{ $t(`contract.mapTabs.${item.name}`) }}</h2>
        <h3 v-if="item.holding > 0" class="text-success">{{ $t(`contract.mapFormContent.mapHandleBtn.buy`) }}</h3>
        <h3 v-else class="text-danger">{{ $t(`contract.mapFormContent.mapHandleBtn.sell`) }}</h3>
        <p class="interval">{{ $tR('lossLimit') }} / {{ $tR('winLimit') }}</p>
        <p><span class="text-success">--</span>  / <span class="text-danger">--</span>

          <el-popover
            placement="top"
            popper-class="custom-popper"
            width="400"
            trigger="click"
          >
            <div>
              <div v-for="index in 2" :key="index" class="popover-body">
                <el-checkbox v-model="checked">止盈</el-checkbox>
                <div flex="main:justify" class="">
                  <label for="">触发类型</label>
                  <el-select v-model="trigger_type" size="small" class="custom-select transactionPrice">
                    <el-option v-for="(subValue,subKey) in mapFormContent.mapTriggerType" :key="subKey" :label="subValue" :value="+subKey" />
                  </el-select>
                </div>
                <div flex="main:justify">
                  <label for="">价格</label>
                  <input :value="1111" type="text" @input="e=>e.target.value.replace(/^(0+)|[^\d.]+/g,'')">
                  <span>USD</span>
                </div>
                <div class="border-active text-active" style="padding:0 10px">盘口价格 上涨 至 11111 将触发 市价止盈单 预计 盈利： 0.00005106 BTC</div>
              </div>
              <el-button type="primary" style="margin-top:12px;width:100%">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-edit hover-point" />
          </el-popover></p>
      </div>
      <div flex style="flex:1;">
        <div flex>
          <div v-for="(value,key,i) in tableColumns" :key="key">
            <p class="text-info" :class="{interval:i>4}">{{ $t(`contract.mapTableTapContents.shipping.mapTableColumns.${key}`) }}
              <el-popover v-if="key === 'margin_position'" placement="top" width="300">
                <div>
                  <div flex="main:justify">
                    <el-radio v-model="checked">增加仓位保证金</el-radio>
                    <el-radio v-model="checked">减少仓位保证金</el-radio>
                  </div>
                  <hr>
                  <div style="font-size:12px; line-height:24px">
                    <p>你的当前仓位: <span class="text-danger"> 1</span> 张合约 (70x)</p>
                    <p>当前已分配的保证金: <span class="text-danger">1.00000203</span> BTC</p>
                    <p>可用保证金: <span class="text-danger">115.82328763</span> BTC</p>
                  </div>
                  <hr>
                  <el-input v-model="input" size="small" placeholder="请输入数量" />
                </div>

                <hr>
                <div flex="main:justify cross:center dir:right">
                  <el-button type="primary" size="mini" @click="closeStorehouse(item,true)">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-edit hover-point" />
              </el-popover>
            </p>
            <p v-if="i<5" class="text-success">{{ key === 'markPrice'?markData[item.currency]:item[key] }}</p>
            <p v-else class="text-success">{{ item[key]|bigRound(8) }}</p>
            <p v-if="i>4">≈ {{ translateByRate(item[key])|bigRound(2) }} USD </p>
          </div>
        </div>
        <div v-if="!item.future_close_id" flex="dir:top cross:center main:justify">
          <el-popover :ref="`popover-${item.name}`" :disabled="disabled" placement="top" width="160">
            <p>确定要以 <span class="text-danger">市价【{{ $t(`contract.mapFormContent.perfactPrice`) }}】</span>平掉所有持仓吗</p>
            <hr>
            <div flex="main:justify cross:center">
              <el-checkbox v-model="visibleChecked">不在提示</el-checkbox>
              <el-button type="primary" size="mini" @click="closeStorehouse(item,true)">确定</el-button>
            </div>
            <el-button slot="reference" type="primary" @click="visibleChecked && closeStorehouse(item,true)">市价平仓</el-button>
          </el-popover>
          <div />
          <el-popover placement="top" width="160">
            <el-input v-model="input" size="small" placeholder="请输入平仓价格" />
            <p style="margin-top:5px">确定到<span class="text-danger">指定价格</span>后平掉所有持仓吗</p>
            <hr>
            <div flex="main:justify cross:center dir:right">
              <!-- <el-checkbox v-model="visibleChecked">不在提示</el-checkbox> -->
              <el-button type="primary" size="mini" :disabled="!input" @click="closeStorehouse(item)">确定</el-button>
            </div>
            <el-button slot="reference" type="primary" plain>限价平仓</el-button>
          </el-popover>
        </div>
        <div v-else class="product-hover">
          <div flex="cross:center">
            <p>你以150的价格发布了平仓委托 <i class="el-icon-close hover-point" title="取消" @click="cancelOrder(item)" /></p>
            <!-- <el-button type="danger" @click="cancelOrder(item)">取消平仓</el-button> -->
          </div>
        </div>
        <!-- <div class="el-loading-mask" style="background-color: rgba(0, 0, 0, 0.8);">
          <div class="el-loading-spinner">
            <p>
              <span><i class="el-icon-bell" /> 系统以150的价格发布了平仓委托 </span>
              <el-link type="danger" :underline="false">取消平仓</el-link>
            </p>
          </div>
        </div> -->
      </div>

    </div>
    <span v-if="data && data.length === 0" class="el-table__empty-text">{{ $t('el.table.emptyText') }}</span>
  </div>
</template>
<script>
import { bigDiv, bigTimes } from '@/utils/handleNum'
import { getRates, closeStorehouse, cancelOrder, setModify } from '@/api/currencyUnit'
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
      disabled: false,
      visibleChecked: false,
      input: '',
      checked: false,
      trigger_type: 1
    }
  },
  computed: {
    mapFormContent() {
      return this.allLangData.contract.mapFormContent
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
      if (this.visibleChecked) {
        this.disabled = true
      }
      const params = { name: item.name, user_id: item.user_id, price: isMarket ? '0' : this.input }
      closeStorehouse(params).then(res => {
        this.$emit('change')
        this.$message.success(this.$t('handleSuccess'))
      })
      this.visible = false
      this.visible1 = false
    },
    cancelOrder(item) {
      const { user_id, future_close_id, name } = item
      cancelOrder({ user_id, order_id: future_close_id, name }).then(res => {
        this.$emit('change')
        this.$message.success(this.$t('handleSuccess'))
      })
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
          padding-right:50px;
          padding-left:10px;
          border-right: 1px dashed #333;
          line-height: 30px;
        }
        &:last-child{
          padding-left:50px;
          &>:first-child{
            flex: 1;
              text-align: left;
              flex-wrap: wrap;
              font-size: 12px;
              &>div{
                width: 20%
            }
          }
          &>.product-hover{
            width:200px;
            background-size:30px 30px;
            background-image:linear-gradient(45deg, $--color-primary 25%, transparent 25%, transparent 50%, $--color-primary 50%, $--color-primary 75%, transparent 75%, transparent);
            animation:barberpole 0.5s linear infinite;
            position: relative;
            &>div{
              position: absolute;
              height: 100%;
              width: 100%;
              left: 0;
              top: 0;
              background: $--contract-table-bg;
              transform: scale(.99);
              padding: 0 20px;
              box-sizing: border-box
            }
          }
        }
      }
    }

  }
  .popover-body>*{
    margin-top: 12px;
    line-height: 32px;
    &>input,&>.transactionPrice{
      background: transparent;
      border: 1px solid #333;
      text-align: center;
      color: #ddd;
      box-sizing: border-box;
      width: 70%;
      font-size: 12px;
    }
    &>input{
      text-align: right;
      padding-right: 45px;
    }
    &>span{
      position:absolute;
      right:14px;
      color:#999;
      border-left: 1px solid #333;
      padding-left: 4px;
    }
  }

</style>
