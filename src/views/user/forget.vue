<template>
  <div class="login-container" flex="main:center cross:center">
    <background />
    <customForm class="custom-form" :schema="schema" :submit-btn="false" label-width="0">
      <div slot="title" class="title-container" flex="main:justify cross:bottom">
        <h2>{{ $tR('forget_pass') }}</h2>
        <div>
          <el-link type="primary" @click="$router.push('/user/login')">返回登录</el-link>
        </div>
      </div>
    </customForm>
  </div>
</template>
<script>
import background from './components/background'
import customForm from '@/components/customForm'
export default {
  name: 'Login',
  components: {
    background,
    customForm
  },
  data() {
    return {
      isEmail: false,
      schema: [
        { fieldType: 'input', prefixIcon: 'el-icon-search', placeholder: '邮箱或手机号', vModel: 'username', default: '', required: true },
        { fieldType: 'input', append: { text: `获取验证码`, disabled: false, click(that) { console.log(111, that) } }, prefixIcon: 'el-icon-search', placeholder: '验证码', vModel: 'username', required: true },
        { fieldType: 'input', prefixIcon: 'el-icon-search', placeholder: '新密码', vModel: 'password', default: '', required: true },
        { fieldType: 'input', prefixIcon: 'el-icon-search', placeholder: '确认新密码', vModel: 'password', default: '', required: true },
        { fieldType: 'button', slotDefault: '重置密码', style: { width: '100%' }, type: 'primary' }
        // { render() {
        //   return <div flex='main:justify cross:center'>
        //     <el-checkbox checked={true}>记住密码</el-checkbox>
        //     <div>
        //       <el-link type='info' onClick={() => this.$router.push('/user/register')} underline={false}>注册账号</el-link>
        //       <el-divider direction='vertical' />
        //       <el-link type='info' onClick={() => this.$router.push('/user/forget')} underline={false}>忘记密码</el-link>
        //     </div>
        //   </div>
        // }, formItemStyle: { marginTop: '-20px' }}
      ]
    }
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
.login-container{
  position: absolute;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  top: 0;
  bottom: 0;
  margin-top: 60px;
  .custom-form{
    padding-bottom:160px;
    width: 20%;
    .title-container{
      color: #ddd;
      margin-bottom: 20px;
    }
  }
}

</style>
