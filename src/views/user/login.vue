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
import { loginByEmail, loginByPhone, getEmailCode, getPhoneCode, loginByPhone2, loginByEmail2 } from '@/api/user'
import { validEmail, validPhone } from '@/utils/validate'
import { setUser, setSession } from '@/utils/auth'
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
        { fieldType: 'input', prefixIcon: 'el-icon-search', placeholder: '邮箱或手机号', errorMassage: '请输入正确邮箱或手机号码', validate: obj => validEmail(obj.username) || validPhone(obj.username), vModel: 'username', default: '', required: true },
        { fieldType: 'input', prefixIcon: 'el-icon-search', type: 'password', placeholder: '密码', vModel: 'password', default: '', required: true },
        { fieldType: 'button', slotDefault: '登录', loading: false, on: { click: ({ field, context }) => {
          const userAccountObj = context.verifyAll()
          if (!userAccountObj) return
          field.loading = true
          const { username, checked, ...data } = userAccountObj
          validEmail(username) && (data.email = username)
          validPhone(username) && (data.phone = username, data.region = 86)
          const handleRes = async res => {
            localStorage.setItem('userAccountObj', checked ? JSON.stringify(userAccountObj) : '')
            setSession(res.data.session_id)
            await this.getCode(username).catch(res => (field.loading = false))
            this.$prompt(`系统已为账号 <span style="color:#13ce66">${username}</span> 发送验证码，请注意查收<br/>没有收到验证码？点击 <a href="javascript:;" style="color:#ff4949" onclick="getCode('${username}')" rel="noopener noreferrer">重新获取验证码</a>`, '邮箱验证', {
              showConfirmButton: false,
              showCancelButton: false,
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true,
              inputPattern: /^\d{6}$/,
              inputErrorMessage: '请输入6位数验证码',
              inputPlaceholder: '请输入邮箱验证码',
              callback: action => action === 'cancel' && (field.loading = false),
              inputValidator: value => {
                let userData = null
                const fn = this.isEmail ? loginByEmail2 : loginByPhone2
                fn(username, value).then(res => {
                  this.$message({ showClose: true, message: '登录成功', type: 'success' })
                  const node = document.querySelector('div.el-message-box__wrapper')
                  const nodeModal = document.querySelector('div.v-modal')
                  node.parentNode.removeChild(node)
                  nodeModal.parentNode.removeChild(nodeModal)
                  userData = res.data
                  setUser(JSON.stringify(userData))
                  this.$store.commit('SET_USERDATA', userData)
                  const redirect = this.$route.query.redirect
                  this.$router.push(redirect || '/user/property')
                })
              }
            }).catch(() => false)
          }
          if (validEmail(username)) {
            this.isEmail = true
            data.email = username
            loginByEmail(data).then(handleRes).catch(res => (field.loading = false))
          } else if (validPhone(username)) {
            this.isEmail = false
            data.phone = username
            data.region = 86
            loginByPhone(data).then(handleRes).catch(res => (field.loading = false))
          } else {
            this.$message.warning('输入的账号名格式有误')
          }
        }
        }, style: { width: '100%' }, type: 'primary' },
        { render() {
          return <div flex='main:justify cross:center'>
            <el-checkbox checked={this.checked} onChange={(value) => this.$emit('change', value)} >记住密码</el-checkbox>
            <div>
              <el-link type='info' onClick={() => this.$router.push('/user/register')} underline={false}>注册账号</el-link>
              <el-divider direction='vertical' />
              <el-link type='info' onClick={() => this.$router.push('/user/forget')} underline={false}>忘记密码</el-link>
            </div>
          </div>
        }, formItemStyle: { marginTop: '-20px' }, props: {
          checked: {
            type: Boolean,
            default: true
          }
        },
        model: {
          prop: 'checked',
          event: 'change'
        }, vModel: 'checked', default: true }
      ]
    }
  },
  created() {
    window.getCode = this.getCode
    const userAccountObj = localStorage.getItem('userAccountObj')
    if (userAccountObj) {
      const { username, password, checked } = JSON.parse(userAccountObj)
      this.schema[0].default = username
      this.schema[1].default = password
      this.schema[3].default = checked
    }
  },
  destroyed() {
    window.getCode = undefined
  },
  methods: {
    getCode(username) {
      const fn = this.isEmail ? getEmailCode : getPhoneCode
      return fn(username).then(res => Promise.resolve(this.$message.success('成功发送验证码')))
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
