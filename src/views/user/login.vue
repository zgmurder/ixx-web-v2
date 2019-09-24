<template>
  <div class="login-container" flex="main:center cross:center">
    <background />
    <customForm ref="customForm" class="custom-form" :schema="schema" :submit-btn="false" label-width="0">
      <div slot="title" class="title-container" flex="main:justify cross:bottom">
        <h2>{{ $tR('login_by_count') }}</h2>
        <!-- <div>
          <el-link :type="isEmail ? 'primary':'info'" @click="isEmail=true">{{ $tR('login_by_email') }}</el-link>
          <el-divider direction="vertical" />
          <el-link :type="isEmail ? 'info':'primary'" @click="isEmail=false">{{ $tR('login_by_phone') }}</el-link>
        </div> -->
      </div>
    </customForm>
  </div>
</template>
<script>
import background from './components/background'
import customForm from '@/components/customForm'
import { loginByEmail2, checkEmail, loginByEmail, loginByPhone } from '@/api/user'
import { validEmail, validPhone } from '@/utils/validate'
import { setUser } from '@/utils/auth'
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
        { fieldType: 'input', prefixIcon: 'el-icon-search', placeholder: '邮箱或手机号', vModel: 'username', default: '294069733@qq.com', required: true },
        // { fieldType: 'input', append: { text: `获取验证码`, disabled: false, click(e, append) {
        //   checkEmail('294069733@qq.com').then(res => {
        //     console.log(res)
        //   })
        //   append.disabled = true
        //   const initValue = append.text
        //   append.text = 45
        //   const timer = setInterval(() => {
        //     if (!append.text) {
        //       append.disabled = false
        //       append.text = initValue
        //       return clearInterval(timer)
        //     }
        //     append.text--
        //   }, 1000)
        // } }, prefixIcon: 'el-icon-search', placeholder: '验证码', vModel: 'username', required: true },
        { fieldType: 'input', prefixIcon: 'el-icon-search', type: 'password', placeholder: '密码', vModel: 'password', default: 'Awuhao123', required: true },
        { fieldType: 'button', slotDefault: '登录', on: { click: ({ context }) => {
          const res = context.verifyAll()
          if (!res) return
          const { username, ...data } = res
          validEmail(username) && (data.email = username)
          validPhone(username) && (data.phone = username, data.region = 86)
          const handleRes = res => {
            setUser(JSON.stringify(res.data))
            this.$store.commit('SET_USERDATA', res.data)
            this.$message.success('登录成功')
            this.$router.push('/user/index')
          }
          if (validEmail(username)) {
            data.email = username
            loginByEmail(data).then(handleRes)
          } else if (validPhone(username)) {
            data.phone = username
            data.region = 86
            loginByPhone(data).then(handleRes)
          } else {
            this.$message.warning('输入的账号名格式有误')
          }
        }
        }, style: { width: '100%' }, type: 'primary' },
        { render() {
          return <div flex='main:justify cross:center'>
            <el-checkbox checked={true}>记住密码</el-checkbox>
            <div>
              <el-link type='info' onClick={() => this.$router.push('/user/register')} underline={false}>注册账号</el-link>
              <el-divider direction='vertical' />
              <el-link type='info' onClick={() => this.$router.push('/user/forget')} underline={false}>忘记密码</el-link>
            </div>
          </div>
        }, formItemStyle: { marginTop: '-20px' }}
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
