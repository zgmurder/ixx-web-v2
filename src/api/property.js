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
// 法币账户 POST /otc/account/balance/list
export const getlegalTenderBalanceList = (data = { page: 1, size: 10 }) => request({
  url: '/otc/account/balance/list',
  method: 'post',
  data
})
// 币币账户 POST /account/balance/list
export const getCoinsBalanceList = (data = { page: 1, size: 10 }) => request({
  url: '/account/balance/list',
  method: 'post',
  data
})
// 合约账户 POST /future/account/balance/list
export const getFutureBalanceList = (data = { page: 1, size: 10 }) => request({
  url: '/future/account/balance/list',
  method: 'post',
  data
})
// 急速账户 POST /future/account/balance/list
export const getShareBalanceList = (data = { currencys: [] }) => request({
  url: '/opt/account/balance',
  method: 'post',
  data
})
// 法币账单 POST /otc/account/balancefills
/* type 收款方式id
currency
begin_stamp
end_stamp
page
size */
export const getOtcHistory = (data) => request({
  url: '/otc/account/balancefills',
  method: 'post',
  data
})
// 法币账单 POST /otc/account/balancefills
/* type 收款方式id
currency
begin_stamp
end_stamp
page
size */
export const getCoinsHistory = (data) => request({
  url: '/otc/account/balancefills',
  method: 'post',
  data
})
// 法币账单 POST /otc/account/balancefills
/* type 收款方式id
currency
begin_stamp
end_stamp
page
size */
export const getFutureHistory = (data) => request({
  url: '/contract/orderhistory',
  method: 'post',
  data
})
// 法币账单 POST /otc/account/balancefills
/* type 收款方式id
currency
begin_stamp
end_stamp
page
size */
export const getShareHistory = (data) => request({
  url: '/otc/account/balancefills',
  method: 'post',
  data
})
