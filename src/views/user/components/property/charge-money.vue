<template>
  <div>
    <slot />
    <div class="form">
      <div flex="main:justify">
        <el-button type="primary" size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
      </div>
      <div flex="main:justify" style="margin:20px 0;">
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
        <el-button size="small" round>主要按钮</el-button>
      </div>

      <customForm ref="customForm" :schema="schema" label-width="80px" />

      <el-divider />

      <p>最低充值数量为 0.001 BTC</p>

      <div class="img-wrap" />

    </div>
  </div>
</template>
<script>
import customForm from '@/components/customForm'

export default {
  components: {
    customForm
  },
  data() {
    return {
      schema: [
        { fieldType: 'input', prefixIcon: 'el-icon-search', label: '币种', placeholder: '币种', vModel: 'username', default: '', required: true },
        { fieldType: 'input', prefixIcon: 'el-icon-search', label: '充币地址', placeholder: '充币地址', vModel: 'username', default: '', required: true }
      ]
    }
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
.form{
  width: 60%;
  margin:0 auto;
  .img-wrap{
    width: 200px;
    height: 200px;
    border: 10px solid $--color-primary
  }
}
</style>
