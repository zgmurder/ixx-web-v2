<template>
  <el-dropdown class="custom-dropdown">
    <span class="el-dropdown-link custom-dropdown-link">
      简体中文<i class="el-icon-arrow-down el-icon--right" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>黄金糕</el-dropdown-item>
      <el-dropdown-item>狮子头</el-dropdown-item>
      <el-dropdown-item>螺蛳粉</el-dropdown-item>
      <el-dropdown-item disabled>双皮奶</el-dropdown-item>
      <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {

}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
  .custom-dropdown-link{
    display: inline-block;
    width: 110px;
    height: 24px;
    margin-left: 20px;
    color: #fff;
    line-height: 24px;
    border-radius: 20px;
    border: 1px solid #fff;
    text-align: center;
    font-size: 12px;
    .el-icon--right{
      transition: all .2s
    }
    &:hover{
      cursor: default;
      .el-icon--right{
        transform: rotate(180deg)
      }
    }
  }
</style>
