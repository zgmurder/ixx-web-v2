<template>
  <div class="container-right">
    <slot />
    <el-divider />
    <custom-table v-loading="loading" :table-list="tableList" :table-columns="tableColumns">
      <!-- <div slot="handlerDom" slot-scope="data">
              <el-button size="mini" :type="isBuy ? 'success' : 'danger'">{{ isBuy ? $tR(`otc_side_1`):$tR(`otc_side_2`) }}{{ digitalActive }}</el-button>
            </div> -->
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
      tableList: [],
      loading: false
    }
  },
  computed: {
    tableColumns() {
      return Object.keys(this.chineseLangData.mapHistoryColumns).map(key => ({
        hearderLabel: this.$tR(`mapHistoryColumns.${key}`),
        prop: key
      }))
    }
  }
}
</script>
