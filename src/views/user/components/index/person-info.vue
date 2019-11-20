<template>
  <div class="person-info-warp" flex="dir:top">
    <div class="top">
      <slot />
      <el-divider />
      <table>
        <tbody>
          <tr height="30px"><td width="200px">UID</td><td>{{ userData.id }}</td></tr>
          <tr v-for="(value,key) in mapTableInfo" :key="key" height="30px">
            <td>{{ $tR(`mapTableInfo.${key}`) }}</td>
            <td><span v-if="userData[key]">{{ userData[key] }}</span><el-link v-else type="primary">{{ $tR(`gotoBind`) }}</el-link></td>
          </tr>
        </tbody>
      </table>
      <h3 style="margin-top:30px">{{ $tR(`history`) }}</h3>
      <el-divider />
    </div>
    <custom-table v-loading="loading" style="flex:1" height="100%" :table-list="tableList" :table-columns="tableColumns">
      <!-- <div slot="handlerDom" slot-scope="data">
              <el-button size="mini" :type="isBuy ? 'success' : 'danger'">{{ isBuy ? $tR(`otc_side_1`):$tR(`otc_side_2`) }}{{ digitalActive }}</el-button>
            </div> -->
    </custom-table>
  </div>
</template>
<script>
import customTable from '@/components/customTable'
import { getHistorys } from '@/api/user'
export default {
  name: 'PersonInfo',
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
      return Object.keys(this.langData.mapHistoryColumns).map(key => ({
        hearderLabel: this.$tR(`mapHistoryColumns.${key}`),
        prop: key
      }))
    },
    mapTableInfo() {
      return this.langData.mapTableInfo
    },
    userData() {
      return this.$store.state.userData
    }
  },
  created() {
    getHistorys().then(res => (this.tableList = res.data))
  }
}
</script>
<style lang="scss" scoped>
.person-info-warp{
  height: 100%;
  .top{
    flex: none
  }
}
</style>
