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
import { getPropertyAccountList, transferAccount, getFinanceList } from '@/api/property'
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
          label: '划转币种'
        },
        {
          render(h, { formData, context }) {
            if (!formData.from)context.$set(formData, 'from', '1')
            if (!formData.to)context.$set(formData, 'to', '2')
            // context.$set(formData, 'to', '2')
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
    getPropertyAccountList().then(res => {
      const obj = this.schema[0]
      obj.options = res.data
      this.formData[obj.vModel] = res.data[0]
      // this.$set(obj, obj.vModel, res.data[0])
    })
  },
  methods: {
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
