<template>
  <div class="container-right">
    <slot />
    <el-divider />
    <custom-table v-loading="loading" :table-list="tableList" :table-columns="tableColumns" :show-header="false">
      <div slot="handlerDom" slot-scope="data" style="float:right">
        <el-button size="mini" type="danger">aaa</el-button>
      </div>
    </custom-table>
  </div>
</template>
<script>
import customTable from '@/components/customTable'
export default {
  name: 'UserCenter',
  components: {
    customTable
  },
  data() {
    return {
      tableList: [
        { name: '手机绑定', status: '未绑定' },
        { name: '手机绑定', status: '未绑定' },
        { name: '手机绑定', status: '未绑定' },
        { name: '手机绑定', status: '未绑定' }
      ],
      loading: false
    }
  },
  computed: {
    tableColumns() {
      return [{ prop: 'name' }, { prop: 'status' }]
    }
  }
}
</script>
