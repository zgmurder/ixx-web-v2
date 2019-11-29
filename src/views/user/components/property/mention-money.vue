<template>
  <div>
    <slot />
    <div class="form">
      <div class="currency-box">
        <div v-for="item in calcOptions" :key="item.id" :class="{'background-active':schema[0][schema[0].vModel] === item.currency}" @click="handleClick(item.currency)">{{ item.currency }}</div>
      </div>

      <customForm ref="customForm" :schema="schema" label-width="80px" />

      <el-divider />

      <p class="text-info">最低充值数量为 0.001 BTC</p>

      <div class="img-wrap">
        <img src="@/assets/charge-money.jpg" width="100%" alt="">
      </div>

      <ul style="line-height:24px;margin-top:20px;font-size:12px;list-style:circle">
        <li>禁止向 USDT 地址充值除 USDT 之外的资产，任何充入 USDT 地址的非 USDT 资产将不可找回</li>
        <li>使用 USDT 地址充值需要 1 个网络确认才能到账</li>
        <li>请认真核对充币地址是否正确一致，如果不一致将导致无法成功充值或资产不可找回</li>
      </ul>

      <el-divider />
    </div>
  </div>
</template>
<script>
import customForm from '@/components/customForm'
import { getCurrencyList, getCurrencyAddress } from '@/api/property'
export default {
  components: {
    customForm
  },
  data() {
    return {
      schema: [
        { fieldType: 'select', on: { change: this.handleClick }, style: { width: '100%' }, prefixIcon: 'el-icon-search', optLabel: 'currency', optValue: 'currency', options: [], label: '币种', placeholder: '币种', vModel: 'currency', default: '', required: true },
        { render(h) {
          return <div class='text-info' flex='main:justify'>
            <div>可用余额: 999998.64985000</div>
            <div>限额: 20000</div>
            <el-link type='success' underline={false}>额度已提升</el-link>
          </div>
        } },
        { fieldType: 'select', options: [], label: '链名称', optLabel: '_chain', optValue: 'chain', style: { width: '100%' }, placeholder: '链名称', vModel: 'chain', default: '' },
        { fieldType: 'input', prefixIcon: 'el-icon-check', label: '提币地址', placeholder: '提币地址', vModel: 'address', default: '', readonly: true }
      ],
      loading: true
    }
  },
  computed: {
    calcOptions() {
      return this.schemaObj.currencySchema.options.length ? this.schemaObj.currencySchema.options.slice(0, 10) : []
    },
    schemaObj() {
      return this.schema.reduce((prev, curr) => {
        prev[`${curr.vModel}Schema`] = curr
        return prev
      }, {})
    }
  },
  created() {
    getCurrencyList().then(res => {
      const otherArr = []
      const ustdArr = res.data.filter(item => {
        if (item.currency === 'USDT') return true
        else otherArr.push(item)
      })
      otherArr.unshift(ustdArr[0])
      this.schemaObj.currencySchema.options = otherArr
      // this.schema[0][this.schema[0].vModel] = res.data[0].currency
      this.schemaObj.chainSchema.options = ustdArr.map(item => {
        if (item.chain === 'ETH')item._chain = `USDT-ERC20`
        else item._chain = `${item.currency}-${item.chain}`
        return item
      }).reverse()
      this.schemaObj.chainSchema[this.schemaObj.chainSchema.vModel] = this.schemaObj.chainSchema.options[0].chain
      this.handleClick(otherArr[0].currency)
    })
  },
  methods: {
    handleClick(value) {
      if (typeof value === 'object')value = value.elementArgs[0]
      this.schemaObj.chainSchema.hidden = value !== 'USDT'
      this.schemaObj.currencySchema[this.schemaObj.currencySchema.vModel] = value
      // this.getCurrencyAddress()
    },
    getCurrencyAddress() {
      const obj = this.$refs.customForm.verifyAll()
      if (!obj) return
      delete obj.address
      getCurrencyAddress(obj).then(res => {
        this.loading = false
      }).catch(res => {
        this.schema[2][this.schema[2].vModel] = '当前测试接口无法获取地址'
        this.schema[2].disabled = true
        this.schema[2].prefixIcon = 'el-icon-check'
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.form{
  width: 60%;
  margin:0 auto;
  .currency-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &>*{
      width: 18%;
      padding: 8px 0;
      text-align: center;
      border-radius: 16px;
      margin-bottom: 22px;
      &:not(.background-active){
        background: #f0f0f0
      }
      &:not(.background-active):hover{
        cursor: pointer;
      }
    }
  }
  .img-wrap{
    width: 200px;
    height: 200px;
    border: 10px solid $--color-primary;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
