<template>
  <div>
    <!-- <zg-table v-loading='loading' :initpage="initpage" :column="tableData.column" :data="tableData.data"  @change="handleChange" >
    </zg-table> -->
    <!-- label-width="80px" -->
    <zg-form ref="zgForm" style="width:60%;margin:0 auto" :schema="schema" label-width="80px" @validate="validate" />
  </div>
</template>

<script>
// import ZgTable from './zg-table/zg-table'
import ZgForm from '@/components/zg-form'
import { getPropertyAccountList } from '@/api/property'
export default {
  name: 'HelloWorld',
  components: {
    // ZgTable,
    ZgForm
  },
  data(vm) {
    return {
      schema: [
        {
          type: 'select',
          config: {
            style: {
              width: '100%'
            }
          },
          vModel: 'regon1',
          options: [],
          required: true,
          label: '划转币种'
        },
        {
          render(h, { formData, context }) {
            return <div>
              <el-col span={11}>
                <el-form-item prop='date1'>
                  <el-date-picker type='date' placeholder='选择日期' on-input={value => context.$set(formData, 'date1', value)} value={formData.date1} style='width: 100%;'></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class='line' style='text-align:center' span={2}>-</el-col>
              <el-col span={11}>
                <el-form-item prop='date2'>
                  <el-date-picker type='date' placeholder='选择日期' on-input={value => context.$set(formData, 'date2', value)} value={formData.date2} style='width: 100%;'></el-date-picker>
                </el-form-item>
              </el-col>
            </div>
          },
          rules: {
            date1: [{ required: true, message: '选择日期', trigger: 'blur' }],
            date2: [{ required: true, message: '选择时间', trigger: 'blur' }]
          },
          label: '活动时间'
        },
        {
          type: 'input',
          vModel: 'name',
          rules: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          label: '活动名称'
        },
        {
          render(h, { that, formData, context }) {
            return <div>
              <el-button type='primary' on-click={() => {
                context.validate((valid) => {
                  if (valid) {
                    console.log(context.formData)
                    alert('submit!')
                  } else {
                    console.log('error submit!!')
                    return false
                  }
                })
              }}>提交</el-button>
              <el-button on-click={() => {
                context.resetFields()
              }} >重置</el-button>
            </div>
          }
        }
      ]
    }
  },
  computed: {
    formData() {
      return this.$refs.zgForm.formData
    }
  },
  created() {
    getPropertyAccountList().then(res => {
      this.schema[0].options = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    validate() {

    }
  }
}
</script>
