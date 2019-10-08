<template>
  <div class="property-manage-warp" flex="dir:top">
    <div class="top">
      <slot />
      <el-divider />
    </div>
    <div class="center">
      <p>IXX 总净资产估值</p>
      <h1 class="numerical">≈ 154543734.1 CNY</h1>
      <el-divider />
    </div>
    <div class="bottom" flex="main:justify">
      <fieldset>
        <legend class="title">资金账户</legend>
        <p flex="main:justify">
          <el-link type="info">关于资金账户</el-link>
          <el-link type="info">财务记录</el-link>
        </p>
        <h2 class="numerical">≈ {{ propertyAccountTotal }} CNY</h2>
        <!-- <custom-table v-loading="false" height="250" :table-list="tableList" :table-columns="mapAccoutColumns">
          <div slot="handlerDom" slot-scope="data">
              <el-button size="mini" :type="isBuy ? 'success' : 'danger'">{{ isBuy ? $tR(`otc_side_1`):$tR(`otc_side_2`) }}{{ digitalActive }}</el-button>
            </div>
        </custom-table> -->
        <!-- <el-divider /> -->
        <div flex="main:justify box:mean">
          <el-button type="danger" icon="el-icon-edit" plain>充币</el-button>
          <el-button type="warning" icon="el-icon-share" plain>提币</el-button>
          <el-button type="success" icon="el-icon-delete" plain>划转</el-button>
        </div>
        <p style="margin-top:25px;line-height:24px;font-size:12px;color:#ccc">
          充币成功后，若想进行”币币交易/法币交易/合约交易，需操作“资金划转”，将“资金账户”的币转移到该账户上。
        </p>
      </fieldset>
      <fieldset>
        <legend class="title">交易账户</legend>
        <p flex="main:justify">
          <el-link type="info">关于资金账户</el-link>
          <el-link type="info">财务记录</el-link>
        </p>
        <h2 class="numerical">≈ {{ dealAccountTotal }} CNY</h2>
        <div class="list">
          <p flex="main:justify">
            <span>法币账户</span>
            <span>财务记录</span>
          </p>
          <p flex="main:justify">
            <span>币币账户</span>
            <span>财务记录</span>
          </p>
          <p flex="main:justify">
            <span>合约账户</span>
            <span>财务记录</span>
          </p>
        </div>
      </fieldset>
    </div>
    <!-- <ul flex="main:justify cross:strech box:mean" class="center">
      <li flex="dir:top main:center cross:center">
        <el-progress type="circle" :percentage="100" :format="()=>'111111'" status="success" />
        <p>154543734.1 CNY</p>
        <p>IXX为您当前估算</p>
      </li>
      <li>b</li>
      <li>c</li>
    </ul> -->
  </div>
</template>
<script>
import customTable from '@/components/customTable'
import { getPropertyAccountList } from '@/api/property'
import { bigTimes } from '@/utils/handleNum'
export default {
  name: 'PropertyManage',
  components: {
    customTable
  },
  data() {
    return {
      tableList: [],
      loading: false,
      currency: 'CNY'
    }
  },
  computed: {
    mapAccoutColumns() {
      return Object.keys(this.chineseLangData.mapAccoutColumns).map(key => ({
        hearderLabel: this.$tR(`mapAccoutColumns.${key}`),
        prop: key
      }))
    },
    mapTableInfo() {
      return this.chineseLangData.mapTableInfo
    },
    userData() {
      return this.$store.state.userData
    },
    propertyAccountTotal() {
      return this.tableList.reduce((prev, curr) => {
        const numbecial = bigTimes([curr.rates[this.currency], curr.available], 2)
        const total = +numbecial + prev
        return total
      }, 0)
    },
    dealAccountTotal() {
      return this.tableList.reduce((prev, curr) => {
        const numbecial = bigTimes([curr.rates[this.currency], curr.available], 2)
        const total = +numbecial + prev
        return total
      }, 0)
    }
  },
  created() {
    getPropertyAccountList().then(res => (this.tableList = res.data))
  }
}
</script>
<style lang="scss" scoped>
.property-manage-warp{
  height: 100%;
  text-align: center;
  &>.center{
    .numerical{
      // line-height: 100px;
      margin-top: 30px;
      color: $--color-danger;
      // border-width: 0 5px 5px 5px;
      // border-style: solid;
      // border-color: rgba($color: $--color-primary, $alpha: .3);
      // padding-bottom: 20px;
    }
  }
  &>.bottom{
    &>fieldset{
      margin: 0;
      padding: 30px;
      box-sizing: border-box;
      width: 48%;
      border: solid 1px #f0f0f0;
      .title{
        font-size: 20px;
      }
      .numerical{
        margin-top:30px;
        margin-bottom: 30px;
        color: rgba($color: $--color-warning, $alpha: 3);
        border-width: 0 5px 5px 5px;
        border-style: solid;
        border-color: #f6f6f6;
        padding-bottom: 20px;
      }
      .list > p{
        line-height: 40px;
      }
    }
  }
}
</style>
