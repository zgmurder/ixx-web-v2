import request from '@/utils/request'

export const checkEmail = email => request({
  url: 'user/email/check',
  method: 'post',
  params: { email, region: 86 }
})
export const loginByEmail2 = email => request({
  url: 'user/login/email/code',
  method: 'post',
  data: { email, region: 86 }
})

export const loginByEmail = data => request({
  url: 'user/login/email',
  method: 'post',
  data
})
export const getEmailCode = () => request({
  url: 'user/login/email/code',
  method: 'post',
  data: {
    email: '294069733@qq.com',
    region: 86
  }
})

export const loginByPhone = data => request({
  url: 'user/login/phone',
  method: 'post',
  data
})
export const loginout = () => request({
  url: 'user/logout',
  method: 'post'
})
export const getHistorys = () => request({
  url: 'user/login/history',
  method: 'post'
})
