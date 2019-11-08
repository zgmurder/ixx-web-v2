import request from  '@/utils/request'

export const futureActivityGet = (params) => request({
  url: `future/activity/wallet/queryUserTag`,
  method: 'post',
  params
})

export const getRates = (params) => request({
  url: `account/currency/rates`,
  method: 'post',
  params
})

export const getPairList = () => request({
  url: `order/symbol/list`,
  method: 'post',
})

export const getBalanceList = () => request({
  url: `order/symbol/list`,
  method: 'post', 
})

