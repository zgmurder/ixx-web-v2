<template>
  <div class="login-container" flex="main:center cross:center">
    <background />
    <customForm ref="customForm" class="login-custom-form" :schema="schema" :submit-btn="false" label-width="0">
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
import { loginByEmail, loginByPhone, getEmailCode, checkEmail, loginByEmail2 } from '@/api/user'
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
        { fieldType: 'button', slotDefault: '登录', loading: false, on: { click: ({ field, context }) => {
          const res = context.verifyAll()
          if (!res) return
          field.loading = true
          const { username, ...data } = res
          validEmail(username) && (data.email = username)
          validPhone(username) && (data.phone = username, data.region = 86)
          const handleRes = async() => {
            await this.getEmailCode(username)
            this.$prompt(`系统已为账号 <span style="color:#13ce66">${username}</span> 发送验证码，请注意查收<br/>没有收到验证码？点击 <a href="javascript:;" style="color:#ff4949" onclick="getEmailCode('${username}')" rel="noopener noreferrer">重新获取验证码</a>`, '邮箱验证', {
              showConfirmButton: false,
              showCancelButton: false,
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true,
              inputPattern: /^\d{6}$/,
              inputErrorMessage: '请输入6位数验证码',
              inputPlaceholder: '请输入邮箱验证码',
              callback: action => action === 'cancel' && (field.loading = false),
              inputValidator: value => {
                loginByEmail2(username, value).then(res => {
                  this.$message.success('登录成功')
                  setUser(JSON.stringify(res.data))
                  this.$store.commit('SET_USERDATA', res.data)
                  const node = document.querySelector('div.el-message-box__wrapper')
                  const nodeModal = document.querySelector('div.v-modal')
                  node.parentNode.removeChild(node)
                  nodeModal.parentNode.removeChild(nodeModal)
                  this.$router.push('/user/index')
                }).catch(() => false)
              }
            }).then(res => {
              console.log(res)
            }).catch(() => false)
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
  },
  created() {
    window.getEmailCode = this.getEmailCode
  },
  destroyed() {
    window.getEmailCode = undefined
  },
  methods: {
    getEmailCode(username) {
      return getEmailCode(username).then(res => Promise.resolve(this.$message.success('成功发送验证码')))
    }
  }
}
</script>
<style lang="scss" scoped="this api replaced by slot-scope in 2.5.0+">
.login-container{
  position: absolute;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  top: 0;
  bottom: 0;
  margin-top: 60px;
  .login-custom-form{
    padding-bottom:160px;
    width: 20%;
    .title-container{
      color: #ddd;
      margin-bottom: 20px;
    }
  }
}

</style>
