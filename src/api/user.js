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
export const loginByPhone = data => request({
  url: 'user/login/phone',
  method: 'post',
  data
})
