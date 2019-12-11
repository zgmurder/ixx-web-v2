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
        <p><span class="text-success">{{ !+item.sl_price?'--':item.sl_price }}</span>  / <span class="text-danger">{{ !+item.tp_price?'--':item.tp_price }}</span>
          <el-popover
            v-model="popoverVisible"
            placement="top"
            popper-class="custom-popper"
            width="400"
            trigger="click"
          >
            <div>
              <div v-for="(formItem,index) in formArrData" :key="index" class="popover-body">
                <el-checkbox v-model="formItem.type">{{ $tR(`${ !index?'winLimit':'lossLimit'}`) }} USD</el-checkbox>
                <div flex="main:justify" class="">
                  <label for="">{{ $t('contract.mapFormContent.mapInput.triggerType') }}</label>
                  <el-select v-model="formItem.trigger_type" :disabled="!formItem.type" size="small" class="custom-select transactionPrice" @change="handleInput(false,formItem,item.holding)">
                    <el-option v-for="(subValue,subKey) in mapFormContent.mapTriggerType" :key="subKey" :label="subValue" :value="+subKey" />
                  </el-select>
                </div>
                <div flex="main:justify">
                  <label for="">{{ $t('contract.mapFormContent.mapInput.triggerPrice') }}</label>
                  <input
                    :disabled="!formItem.type" :value="formItem.trigger_price"
                    type="text" @input="handleInput($event,formItem,item.holding)"
                  >
                  <span>USD</span>
                </div>
                <div class="border-active text-active" style="padding:0 10px">
                  <i class="text-success">{{ mapFormContent.mapTriggerType[formItem.trigger_type] }}</i>
                  <i class="text-success">{{ $t(`${item.holding>0 || !index?'down':'up'}`) }}</i> 至
                  <i class="text-success">{{ formItem.trigger_price||'--' }}</i> 将触发 市价止盈单 预计 盈利：
                  <i class="text-success">{{ formItem.calcProfit||'--' }}</i> {{ item.currency }}</div>
              </div>
              <el-button type="primary" style="margin-top:12px;width:100%" :loading="buyBtnLoading" :disabled="verifyPopoverBtn(item.price,item.holding>0)" @click="submitOrder(item)">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-edit hover-point" @click="handleEdit(item)" />
          </el-popover></p>
      </div>
      <div flex style="flex:1;">
        <div flex>
          <div v-for="(value,key,i) in tableColumns" :key="key">
            <p class="text-info" :class="{interval:i>4}">{{ $t(`contract.mapTableTapContents.shipping.mapTableColumns.${key}`) }}
              <el-popover v-if="key === 'margin_position'" v-model="margin_popover" placement="top" width="400">
                <div>
                  <!-- <div flex="main:justify">
                    <el-radio v-model="checked">增加仓位保证金</el-radio>
                    <el-radio v-model="checked">减少仓位保证金</el-radio>
                  </div>
                  <hr> -->
                  <div class="text-info" style="font-size:12px; line-height:24px">
                    <p>你的当前仓位: <span class="text-danger"> {{ item.holding }}</span> 张合约 ({{ item.leverage }}x)</p>
                    <p>当前已分配的保证金: <span class="text-danger">{{ item.margin_position }}</span> BTC 【最大可减少 <span class="text-danger">{{ Math.floor(item.margin_position) }}</span> {{ item.currency }}】<span class="text-danger hover-point" @click="margin_position = -Math.floor(item.margin_position)">全部</span></p>
                    <p>可用保证金: <span class="text-danger">{{ item.available_balance }}</span> BTC【最大可增加 <span class="text-danger">{{ Math.floor(item.available_balance) }}</span> {{ item.currency }}】<span class="text-danger hover-point" @click="margin_position = Math.floor(item.available_balance)">全部</span></p>
                  </div>
                  <el-input-number v-model="margin_position" size="small" :min="-Math.floor(item.margin_position)" :max="Math.floor(item.available_balance)" style="width:100%" placeholder="请输入数量" />
                </div>
                <hr>
                <div flex="main:justify cross:center dir:right">
                  <el-button type="primary" size="mini" @click="setTransferMargin(item)">确定</el-button>
                </div>
                <i slot="reference" class="el-icon-edit hover-point" />
              </el-popover>
            </p>
            <p v-if="i<5" class="text-success">{{ key === 'markPrice'?markData[item.currency]:item[key] }}</p>
            <p v-else class="text-success">{{ item[key]|bigRound(8) }} <span v-if="i==5||i==6">{{ item.currency }}</span> </p>
            <p v-if="i>4">≈ {{ translateByRate(item[key])|bigRound(2) }} USD </p>
          </div>
        </div>
        <div v-if="!item.future_close_id" flex="dir:top cross:center main:justify">
          <!-- <el-popover :ref="`popover-${item.name}`" :disabled="disabled" placement="top" width="160">
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
            <el-input :value="input||markData[item.currency]" selected size="small" autofocus placeholder="请输入平仓价格" @input="value=>input=value" />
            <p style="margin-top:5px">确定到<span class="text-danger">指定价格</span>后平掉所有持仓吗</p>
            <hr>
            <div flex="main:justify cross:center dir:right">
              <el-button type="primary" size="mini" @click="closeStorehouse(item)">确定</el-button>
            </div>
            <el-button slot="reference" type="primary" plain>限价平仓</el-button>
          </el-popover> -->
          <div flex="dir:top" style="font-size:12px">
            <div>平仓价格</div>
            <input :value="input||markData[item.currency]" class="custom-input" style="width:80px" @input="e=>input = e.target.value">
          </div>
          <div class="el-button el-button--small bd-succes" @click="closeStorehouse(item,true)">限价平仓</div>
          <div class="el-button el-button--small bd-succes" style="margin-left:0" @click="closeStorehouse(item)">市价平仓</div>
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
import { bigDiv, bigTimes, calcProfit } from '@/utils/handleNum'
import { getRates, closeStorehouse, cancelOrder, setModify, setTransferMargin, submitOrder } from '@/api/currencyUnit'
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
    },
    activeProduct: {
      type: [Object, String],
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
      margin_position: '',
      input: '',
      checked: false,
      trigger_type: 1,
      buyBtnLoading: false,
      popoverVisible: false,
      margin_popover: false,
      formArrData: [
        {
          type: false,
          trigger_type: 1,
          trigger_price: '',
          isEdit: false,
          calcProfit: ''
        },
        {
          type: false,
          trigger_type: 1,
          trigger_price: '',
          isEdit: false,
          calcProfit: ''
        }
      ]
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
    setTransferMargin(item) {
      setTransferMargin({ name: item.name, amount: this.margin_position }).then(res => {
        this.$emit('change')
        this.margin_popover = false
        this.margin_position = 0
        this.$message.success(this.$t('handleSuccess'))
      })
    },
    handleInput(e, formItem, amount) {
      e && (formItem.trigger_price = e.target.value.replace(/^(0+)|[^\d]+/g, ''))
      const obj = {
        1: 'UNIT',
        2: 'INDEX',
        3: 'MARKET'
      }
      formItem.calcProfit = formItem.trigger_price ? calcProfit(amount, this.activeProduct[obj[formItem.trigger_type]].current, formItem.trigger_price) : '--'
    },
    handleEdit(holdingObj) {
      if (holdingObj.tp_price && +holdingObj.tp_price) {
        this.formArrData[0].type = true
        this.formArrData[0].trigger_price = holdingObj.tp_price
        this.formArrData[0].isEdit = true
      } else {
        this.formArrData[0].isEdit = false
        this.formArrData[0].type = false
      }
      this.handleInput(false, this.formArrData[0], holdingObj.holding)
      if (holdingObj.sl_price && +holdingObj.sl_price) {
        this.formArrData[1].type = true
        this.formArrData[1].trigger_price = holdingObj.sl_price
        this.formArrData[1].isEdit = true
      } else {
        this.formArrData[1].isEdit = false
        this.formArrData[1].type = false
      }
      this.handleInput(false, this.formArrData[1], holdingObj.holding)
    },
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
    async closeStorehouse(item, isMarket) {
      console.log(item)

      const isOk = await this.confirm(`<span class="text-danger">卖出</span>在${isMarket ? this.input || this.markData[item.currency] : '最优'}价格${item.holding}张BTC合约在执行时，将平掉你的整个仓位`, isMarket ? '限价平仓' : '市价平仓')
      if (!isOk) return
      const params = { name: item.name, user_id: item.user_id, price: isMarket ? '0' : this.input }
      closeStorehouse(params).then(res => {
        this.$emit('change')
        this.$message.success(this.$t('handleSuccess'))
      })
      // if (this.visibleChecked) {
      //   this.disabled = true
      // }
      // const params = { name: item.name, user_id: item.user_id, price: isMarket ? '0' : this.input }
      // closeStorehouse(params).then(res => {
      //   this.$emit('change')
      //   this.$message.success(this.$t('handleSuccess'))
      // })
      // this.visible = false
      // this.visible1 = false
    },
    cancelOrder(item) {
      const { user_id, future_close_id, name } = item
      cancelOrder({ user_id, order_id: future_close_id, name }).then(res => {
        this.$emit('change')
        this.$message.success(this.$t('handleSuccess'))
      })
    },
    verifyPopoverBtn(price, correct) {
      if (!this.formArrData[0].type && !this.formArrData[1].type) return true
      if (this.formArrData[0].type && +this.formArrData[0].trigger_price > +price) return !correct
      if (this.formArrData[1].type && +this.formArrData[1].trigger_price < +price) return !correct
    },
    submitOrder(holdingObj) {
      // const product = this.activeProduct
      const { passive, holding, buy, tp_price, sl_price, name, future_sl_id, future_tp_id } = holdingObj
      this.buyBtnLoading = true
      this.formArrData.forEach((item, index) => {
        const data = index === 0 ? { tp_type: -1, type: item.type && '6', order_id: future_tp_id } : { sl_type: -1, type: item.type && '4', order_id: future_sl_id }
        if (item.type) {
          const fun = item.isEdit ? setModify : submitOrder
          if (item.isEdit && item.trigger_price === (!index ? tp_price : sl_price)) return
          fun({ amount: Math.abs(holding), passive, price: '0', side: buy ? 2 : 1, name, ...item, ...data }).then(res => {
            this.$emit('change')
            this.buyBtnLoading = false
            this.$message.success(this.$t('handleSuccess'))
            this.popoverVisible = false
          })
        }
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
      &:disabled{
        color: #333;
        cursor: not-allowed
      }
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
