
import request from '@/utils/request'
import axios from 'axios'
// import jsonp from '@/utils/jsonp'
// import { param } from '@/utils'
const I = process.env.VUE_APP_BASE_API_I
const Q = process.env.VUE_APP_BASE_API_Q

const request_q = data => {
  data.url = Q + data.url
  return request(data)
}
export const getFutureDictionaryList = query => request({
  url: '/contract/symbol/list',
  method: 'post',
  params: query
})
export const getFutureListByKey = (key, query) => request({
  url: `/Q/v1/deal/FUTURE_${key}USD`,
  method: 'get',
  params: query
})
// export const getFutureListByKey = (key, query = {}) => {
//   const params = param(query)
//   return new Promise((resolve, reject) => {
//     jsonp(`https://q.ixex.pro/v1/deal/FUTURE_${key}USD?${params}`, (err, data) => {
//       console.log(err, data, 222)
//       if (err) {
//         return reject(err)
//       } else {
//         return resolve(data)
//       }
//     })
//   })
// }

export const getBars = (key, query) => request({
  url: `/Q/v1/deal/FUTURE_${key}USD`,
  method: 'get',
  params: query
})

export const getSymbolList = () => request({
  url: `/Q/v1/market/pairs`,
  method: 'get'
})
// export const getSymbolList = () => request_q({
//   url: `/v1/market/pairs`,
//   method: 'get'
// })
export const getHistoryByPeriodOrPairs = (params = { period: '1m', pairs: 'ETH_BTC,EOS_BTC,UNKNOWN' }) => request_q({
  url: `/v1/market/histories`,
  method: 'get',
  params
})
export const getDishDataByPairs = (params = { pairs: 'ETH_BTC,EOS_BTC,UNKNOWN' }) => request_q({
  url: `/v1/market/tickers`,
  method: 'get',
  params
})
export const getSymbolQuote = symbol => request_q({
  url: `/v1/ticker/${symbol}`,
  method: 'get'
})
export const getHistoryBySymbol = (symbol, params = { period: '1m', size: 10 }) => request_q({
  url: `/v1/history/${symbol}`,
  method: 'get',
  params
})
export const getHistoryBySymbolAndOption = (symbol, params = { period: '1m', begin: Date(), end: Date() }) => request_q({
  url: `/v1/history/millis/${symbol}`,
  method: 'get',
  params
})
export const getReachDataBySymbol = (symbol, params = { size: 10 }) => request_q({
  url: `/v1/deal/${symbol}`,
  method: 'get',
  params
})
export const getOrderDataBySymbol = (symbol, params = { offset: 0, accuracy: 1, size: 10 }) => request_q({
  url: `/v1/orderbook/${symbol}`,
  method: 'get',
  params
})

// getQuoteOrderbook({ pair, accuracy, offset, size }) {
//   return quote(`orderbook/${pair}`, { offset, accuracy, size })
// },
