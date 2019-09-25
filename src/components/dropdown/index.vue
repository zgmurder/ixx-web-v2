<template>
  <span class="drop-down-wrap">
    <slot />
    <ul class="menu-box">
      <li v-for="(item,index) in menuOptions" :key="index" class="item" @click="handle(item)">{{ item.label }}</li>
    </ul>
  </span>
</template>
<script>
export default {
  props: {
    menuOptions: {
      type: [Array, Object],
      default: () => []
    }
  },
  methods: {
    handle(item) {
      item.click && item.click(item) || this.$router.push({ path: item.path })
    }
  }
}
</script>
<style lang="scss" scoped="this api replaced by slot-scope in 2.5.0+">
.drop-down-wrap{
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  &:hover{
    color: #01CED1;
    cursor: pointer;
    .menu-box{
      display: block;
    }
  }
  .menu-box{
    // margin-top: -5px;
    position: absolute;
    top: 100%;
    display: none;
    background: rgba(255,255,255,1);
    box-shadow: 0 0 20px 0 rgba(69,97,137,.2);
    border-radius: 4px;
    display: block;
    box-sizing: border-box;
    position: absolute;
    z-index: 10;
    min-width: 120px;
    padding: 5px;
    display: none;
    &>.item{
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      // background: #fff;
      white-space: nowrap;
      text-indent: 10px;
      text-decoration: none;
      color: #999;
      &:not(:last-child){
        border-bottom: 1px solid #dadada
      }
      &:hover{
        color: #000
      }
    }
    // .menu{
    //   // margin-top: 20px;
    //   line-height: 32px;
    //   // background:#2B2B2B;
    //   // border-radius: 5px;
    //   text-indent: 10px;
    //   // color: #f0f0f0;
    //   // font-size: 14px;
    //   &>li{
    //     width: 100%;
    //     &.active,&:hover{
    //       color: #01CED1
    //     }
    //   }
    // }
  }

}

</style>
