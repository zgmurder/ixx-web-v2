<template>
  <ul class="menu-list">
    <!--  :class="{active:activeKey === key}" @click="handleClick(key)" -->
    <li v-for="(item,key) in mapMenuList" :key="key" :class="{active:active === item.key}" @click="$emit('change',item.key)">{{ item.label }}</li>
  </ul>
</template>
<script>
export default {
  model: {
    prop: 'active',
    event: 'change'
  },
  props: {
    mapMenuList: {
      type: [Object, Array],
      default: () => []
    },
    active: {
      type: String,
      default: ''
    }
  },
  beforeMount() {
    this.$emit('change', this.active)
  }
}
</script>
<style lang="scss" scoped>
.menu-list{
  // border: 1px solid $border-color-lighter;
  background: #fff;
  &>li{
    line-height: 40px;
    height: 40px;
    border: 1px solid $border-color-lighter;
    text-align: center;
    color: #999;
    cursor: pointer;
    &:not(:first-child){
      border-top: none;
    }
    &:not(.active):hover{
      color: #333;
      background: #fafafa
    }
    &.active{
      box-shadow: inset 3px 0 0 0 $--color-primary;
      background: $--background-active-bg;
    }
  }
}
</style>
