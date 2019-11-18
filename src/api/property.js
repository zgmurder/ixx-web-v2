import request from '@/utils/request'
export const getPropertyAccountList = (data) => request({
  url: '/account/wallet/list',
  method: 'post',
  data
})

// 划转记录 POST /account/balance/finance/list
export const getFinanceList = (data = { page: 1, size: 10 }) => request({
  url: '/account/balance/finance/list',
  method: 'post',
  data
})
// 获取充值记录 POST /account/deposit/list
export const getDepositList = (data = { page: 1, size: 10 }) => request({
  url: '/account/deposit/list',
  method: 'post',
  data
})
// 获取提现记录 POST /account/withdraw/list
export const getWithdrawList = (data = { page: 1, size: 10 }) => request({
  url: '/account/withdraw/list',
  method: 'post',
  data
})
