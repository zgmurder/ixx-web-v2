
<script>
// import customForm from '@/components/customForm'
// import { getCurrencyList, getCurrencyAddress } from '@/api/property'
// export default {
//   components: {
//     customForm
//   },
//   data() {
//     return {
//       schema: [
//         // { fieldType: 'select', on: { change: this.handleClick }, style: { width: '100%' }, prefixIcon: 'el-icon-search', optLabel: 'currency', optValue: 'currency', options: [], label: '币种', placeholder: '币种', vModel: 'currency', default: '', required: true },
//         // { fieldType: 'select', options: [], label: '链名称', optLabel: '_chain', optValue: 'chain', style: { width: '100%' }, placeholder: '链名称', vModel: 'chain', default: '' }
//         // { fieldType: 'input', prefixIcon: 'el-icon-loading', label: '充币地址', placeholder: '充币地址', vModel: 'address', default: '正在获取地址...', readonly: true }
//       ],
//       loading: true
//     }
//   },
//   computed: {
//     calcOptions() {
//       return this.schema[0].options.length ? this.schema[0].options.slice(0, 10) : []
//     }
//   },
//   created() {
//     getCurrencyList().then(res => {
//       const otherArr = []
//       const ustdArr = res.data.filter(item => {
//         if (item.currency === 'USDT') return true
//         else otherArr.push(item)
//       })
//       otherArr.unshift(ustdArr[0])
//       this.schema[0].options = otherArr
//       // this.schema[0][this.schema[0].vModel] = res.data[0].currency
//       this.schema[1].options = ustdArr.map(item => {
//         if (item.chain === 'ETH')item._chain = `USDT-ERC20`
//         else item._chain = `${item.currency}-${item.chain}`
//         return item
//       }).reverse()
//       this.schema[1][this.schema[1].vModel] = this.schema[1].options[0].chain
//       this.handleClick(otherArr[0].currency)
//     })
//   },
//   methods: {
//     handleClick(value) {
//       if (typeof value === 'object')value = value.elementArgs[0]
//       this.schema[1].hidden = value !== 'USDT'
//       this.schema[0][this.schema[0].vModel] = value
//       // this.getCurrencyAddress()
//     },
//     getCurrencyAddress() {
//       const obj = this.$refs.customForm.verifyAll()
//       if (!obj) return
//       delete obj.address
//       this.schema[2][this.schema[2].vModel] = '正在获取地址...'
//       this.schema[2].disabled = false
//       this.schema[2].prefixIcon = 'el-icon-loading'
//       getCurrencyAddress(obj).then(res => {
//         this.loading = false
//       }).catch(res => {
//         this.schema[2][this.schema[2].vModel] = '当前测试接口无法获取地址'
//         this.schema[2].disabled = true
//         this.schema[2].prefixIcon = 'el-icon-check'
//       })
//     }
//   }

// }
</script>
<template>
  <div>
    <!-- <zg-table v-loading='loading' :initpage="initpage" :column="tableData.column" :data="tableData.data"  @change="handleChange" >
    </zg-table> -->
    <!-- label-width="80px" -->
    <zg-form ref="zgForm" style="width:40%;margin-top:20px" :schema="schema" label-width="80px" />
    <el-divider />
    <zg-table v-loading="loading" size="small" style="flex:1" :init-page="{pageSize:10}" :column="mapAccoutColumns" border stripe :data="tableList" @change="handlePageChange" />
  </div>
</template>

<script>
// import ZgTable from './zg-table/zg-table'
import ZgForm from '@/components/zg-form'
import ZgTable from '@/components/zg-table'
import { getPropertyAccountList, transferAccount, getFinanceList,getCurrencyList } from '@/api/property'
import { mapAccount } from '@/const'
export default {
  name: 'FinancialRecord',
  components: {
    ZgTable,
    ZgForm
  },
  data(vm) {
    return {
      loading: false,
      tableList: [],
      schema: [
        {
          type: 'select',
          config: {
            style: {
              width: '100%'
            },
            valueKey: 'full_name',
            handleLabel: item => item.currency
          },
          required: true,
          vModel: 'currency',
          options: [],
          label: '币种'
        },
        {
          type: 'select',
          config: {
            style: {
              width: '100%'
            },
            valueKey: 'full_name',
            handleLabel: item => item.chain
          },
          required: true,
          vModel: 'link',
          options: [],
          label: '链名称'
        },
        {
          render(h, { formData, context }) {
            context.$set(formData, 'from', '1')
            context.$set(formData, 'to', '2')
            return <div>
              <el-col span={11}>
                <el-form-item prop='from'>
                  <el-select placeholder='选择账户' on-change={value => context.$set(formData, 'from', value)} value={formData.from} style='width: 100%;'>
                    {Object.keys(mapAccount).filter(key => key !== formData.to).map(key => (<el-option label={mapAccount[key]} value={key}></el-option>))}
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class='line' style='text-align:center' span={2}>-</el-col>
              <el-col span={11}>
                <el-form-item prop='to'>
                  <el-select placeholder='选择账户' on-input={value => context.$set(formData, 'to', value)} value={formData.to} style='width: 100%;'>
                    {Object.keys(mapAccount).filter(key => key !== formData.from).map(key => (<el-option label={mapAccount[key]} value={key}></el-option>))}
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
          },
          rules: {
            from: [{ required: true, message: '选择源账户', trigger: 'change' }],
            to: [{ required: true, message: '选择目标账户', trigger: 'change' }]
          },
          label: '划转账户'
        },
        {
          type: 'input',
          config: {
            placeholder: '输入数量'
          },
          vModel: 'amount',
          label: '划转数量'
        },
        {
          render(h, { that, formData, context }) {
            return <div flex='main:justify'>
              <div class='text-info'>
                可划转数量：{(formData.currency || {}).available} {(formData.currency || {}).currency}
              <span class='text-success hover-point' on-click={() => (formData.amount = formData.currency.available)}> 全部</span>
              </div>
              <el-button style='flex:1;margin-left:12px' disabled={!formData.amount} type='primary' on-click={() => {
                context.validate(valid => {
                  if (!valid) return
                  transferAccount({ ...formData, type: 1 }).then(res => {
                    context.$message.success(context.$t('handleSuccess'))
                    context.resetFields()
                  })
                })
              }}>确定</el-button>
            </div>
          }
        }
      ]
    }
  },
  computed: {
    formData() {
      return this.$refs.zgForm.formData
    },
    mapAccoutColumns() {
      const mapTableColumns = this.langData.mapTableColumns[1]
      return Object.keys(mapTableColumns).map(key => {
        const obj = { prop: key, label: mapTableColumns[key] }
        return obj
      })
    }
  },
  created() {
    // getPropertyAccountList().then(res => {
    //   const obj = this.schema[0]
    //   obj.options = res.data
    //   this.formData[obj.vModel] = res.data[0]
    //   // this.$set(obj, obj.vModel, res.data[0])
    // })
    getCurrencyList().then(res => {
      const otherArr = []
      const ustdArr = res.data.filter(item => {
        if (item.currency === 'USDT') return true
        else otherArr.push(item)
      })
      otherArr.unshift(ustdArr[0])
      this.schema[0].options = otherArr
      // this.schema[0][this.schema[0].vModel] = res.data[0].currency
      this.schema[1].options = ustdArr.map(item => {
        if (item.chain === 'ETH')item._chain = `USDT-ERC20`
        else item._chain = `${item.currency}-${item.chain}`
        return item
      }).reverse()
      this.schema[1][this.schema[1].vModel] = this.schema[1].options[0].chain
      // this.handleClick(otherArr[0].currency)
    })
  },
  methods: {
    handleClick(value) {
      if (typeof value === 'object')value = value.elementArgs[0]
      this.schema[1].hidden = value !== 'USDT'
      this.schema[0][this.schema[0].vModel] = value
      // this.getCurrencyAddress()
    },
    handlePageChange(pageConfig) {
      this._temPageConfig = pageConfig || this._temPageConfig
      if (!pageConfig) this._temPageConfig.init()
      const { pageSize, currentPage } = this._temPageConfig
      this.loading = true
      getFinanceList({ page: currentPage, size: pageSize }).then(res => {
        this.tableList = res.data.data || []
        this._temPageConfig.total = res.data.total
        this.loading = false
      })
    }
  }
}
</script>

