<template>
  <div class="history">
    <!-- <el-collapse-transition>
      <ul class="content">
        <li v-for="(item,index) in data" :key="index">
          <div flex="main:justify cross:center">
            <span class="rise_or_fall">{{ item.symbol }} <svg-icon :icon-class="item.trade_type?'hong':'lv'" /></span>
            <span v-if="item.sett_time" class="share-text-info">{{ item.sett_time | parseTime }}</span>
          </div>
          <div flex="main:justify cross:center">
            <div class="money"><span class="share-text-info">投资 </span><p>{{ item.amount }} {{ item.currency }}</p></div>
            <div>
              <span class="share-text-info">收益 </span>
              <p class="share-text-success">{{ item.income }} <i v-if="!item.income" class="el-icon-loading" /> {{ item.currency }}</p>
            </div>
            <div class="earning"><span class="share-text-info">价值 </span><p>{{ item.profile }} <i v-if="!item.profile" class="el-icon-loading" /> {{ item.currency }}</p></div>
          </div>
        </li>
      </ul>
    </el-collapse-transition> -->
    <transition-group v-if="data" appear name="list" tag="ul" class="content">
      <li v-for="item in data" :key="item.order_id">
        <div flex="main:justify cross:center">
          <span class="rise_or_fall">{{ item.symbol }} <svg-icon :icon-class="item.trade_type?'hong':'lv'" /></span>
          <span v-if="item.sett_time" class="share-text-info">{{ item.sett_time | parseTime }}</span>
        </div>
        <div flex="main:justify cross:center">
          <div class="money"><span class="share-text-info">投资 </span><p>{{ item.amount }} {{ item.currency }}</p></div>
          <div>
            <span class="share-text-info">收益 </span>
            <p class="share-text-success">{{ item.income }} <i v-if="!item.income" class="el-icon-loading" /> {{ item.currency }}</p>
          </div>
          <div class="earning"><span class="share-text-info">价值 </span><p>{{ item.profile }} <i v-if="!item.profile" class="el-icon-loading" /> {{ item.currency }}</p></div>
        </div>
      </li>
    </transition-group>
    <div v-else>
      <div v-if="!$store.state.userData" style="margin-top:50px;" flex="main:center"><el-button type="danger" @click="$router.push({path:'/user/login',query:{redirect:$route.path}})">登录</el-button> <el-button type="success">注册</el-button></div>
      <div v-else flex="dir:top cross:center" class="no-data">
        <svg-icon icon-class="404" style="font-size:50px" />
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShareHistory',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    load() {
      console.log(1111)
    }
  }
}
</script>
<style lang="scss" scoped>
.history{
  .content{
    &>li{
      line-height:1.8;
      padding: 10px;
      margin-bottom:10;
      border-bottom: 1px dashed #3B414F;
      font-size: 12px;
    }
  }
  .no-data{
    line-height: 50px;
    padding-top:50px;
    color: #999;
    border-top: 1px solid #2a3550
  }
}
.list-enter-active, .list-leave-active {
  transition: all 2s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}

</style>
