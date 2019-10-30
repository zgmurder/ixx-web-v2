
import request from '@/utils/request'

const proxy_q = process.env.VUE_APP_PROXY_Q

export const getFutureDictionaryList = query => request({
  url: '/contract/symbol/list',
  method: 'post',
  params: query
})
export const getFutureListByKey = (key, query) => request({
  url: `${proxy_q}/v1/deal/FUTURE_${key}USD`,
  method: 'get',
  params: query
})

export const getBars = (key, query) => request({
  url: `${proxy_q}/v1/deal/FUTURE_${key}USD`,
  method: 'get',
  params: query
})

export const getSymbolList = () => request({
  url: `${proxy_q}/v1/market/pairs`,
  method: 'get'
})
export const getHistoryByPeriodOrPairs = (params = { period: '1m', pairs: 'ETH_BTC,EOS_BTC,UNKNOWN' }) => request({
  url: `${proxy_q}/v1/market/histories`,
  method: 'get',
  params
})
export const getDishDataByPairs = (params = { pairs: 'ETH_BTC,EOS_BTC,UNKNOWN' }) => request({
  url: `${proxy_q}/v1/market/tickers`,
  method: 'get',
  params
})
export const getSymbolQuote = symbol => request({
  url: `${proxy_q}/v1/ticker/${symbol}`,
  method: 'get'
})
export const getHistoryBySymbol = (symbol, params = { period: '1m', size: 10 }) => request({
  url: `${proxy_q}/v1/history/${symbol}`,
  method: 'get',
  params
})
export const getHistoryBySymbolAndOption = (symbol, params = { period: '1m', begin: Date(), end: Date() }) => request({
  url: `${proxy_q}/v1/history/millis/${symbol}`,
  method: 'get',
  params
})
export const getReachDataBySymbol = (symbol, params = { size: 10 }) => request({
  url: `${proxy_q}/v1/deal/${symbol}`,
  method: 'get',
  params
})
export const getOrderDataBySymbol = (symbol, params = { offset: 0, accuracy: 1, size: 10 }) => request({
  url: `${proxy_q}/v1/orderbook/${symbol}`,
  method: 'get',
  params
})

// getQuoteOrderbook({ pair, accuracy, offset, size }) {
//   return quote(`orderbook/${pair}`, { offset, accuracy, size })
// },
