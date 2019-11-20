<template>
  <div class="container-right">
    <slot />
    <el-divider />
    <el-steps :active="1" finish-status="success" align-center>
      <el-step title="基本信息认证(一级认证)" description="可以进行币币交易，BTC提币上限为2个，若需提额，请完成第二次认证" />
      <el-step title="高级认证(二级认证)" description="需要上传身份证正反面，认证通过之后可以进行所有交易" />
    </el-steps>
    <el-divider />
    <customForm ref="customForm" :schema="schema" :submit-btn="false" label-width="0">
      <div slot="title" class="title-container" flex="main:justify cross:bottom">
        <h2>aaaa</h2>
        <!-- <div>
          <el-link :type="isEmail ? 'primary':'info'" @click="isEmail=true">{{ $tR('login_by_email') }}</el-link>
          <el-divider direction="vertical" />
          <el-link :type="isEmail ? 'info':'primary'" @click="isEmail=false">{{ $tR('login_by_phone') }}</el-link>
        </div> -->
      </div>
    </customForm>

  </div>
</template>
<script>
// import customTable from '@/components/customTable'
import customForm from '@/components/customForm'

export default {
  name: 'UserCenter',
  components: {
    customForm
  },
  data() {
    return {
      tableList: [],
      loading: false,
      schema: [
        { fieldType: 'upload', action: 'sssss', slot: { render(h) {
          return <div><el-button size='small' type='primary'>点击上传</el-button>
            <div slot='tip' class='el-upload__tip'>只能上传jpg/png文件，且不超过500kb</div>
          </div>
        } }},
        { fieldType: 'input', prefixIcon: 'el-icon-search', type: 'password', placeholder: '密码', vModel: 'password', default: 'Awuhao123', required: true },
        { fieldType: 'button', slotDefault: '登录', style: { width: '100%' }, type: 'primary' }
      ]
    }
  },
  computed: {
    tableColumns() {
      return Object.keys(this.langData.mapHistoryColumns).map(key => ({
        hearderLabel: this.$tR(`mapHistoryColumns.${key}`),
        prop: key
      }))
    }
  }
}
</script>
