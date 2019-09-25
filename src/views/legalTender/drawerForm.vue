<template>
  <div class="drawerForm">
    <!-- <el-divider /> -->
    <div class="btn-group">
      <el-button round>默认按钮</el-button>
      <el-button type="primary" round>主要按钮</el-button>
    </div>
    <custom-form :schema="formSchema">我来啦!</custom-form>
  </div>
</template>
<script>
import customForm from '@/components/customForm'
export default {
  name: 'DrawerForm',
  components: {
    customForm
  },
  data() {
    return {
      formSchema: [
        {}
      ]
    }
  }
}
</script>
<style lang="scss" scoped="this api replaced by slot-scope in 2.5.0+">
.drawerForm{
  .btn-group{
    display: flex;
    justify-content: space-evenly
  }
}

</style>
