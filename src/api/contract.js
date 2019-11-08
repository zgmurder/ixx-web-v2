
import request from '@/utils/request'

const proxy_q = process.env.VUE_APP_PROXY_Q

export const getFutureDictionaryList = query => request({
  url: '/contract/symbol/list',
  method: 'post',
  params: query
})
export const getFutureListByKey = (key, query) => request({
  url: `${proxy_q}/v1/deal/${key}`,
  method: 'get',
  params: query
})

export const getBars = (key, query) => request({
  url: `${proxy_q}/v1/deal/FUTURE_${key}USD`,
  method: 'get',
  params: query
})

// export const getSymbolList = () => request({
//   url: `${proxy_q}/v1/market/pairs`,
//   method: 'get'
// })
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
// 获取交易对列表 POST /contract/symbol/list
export const getSymbolList = data => request({
  url: `/contract/symbol/list`,
  method: 'post',
  data
})
// 用户余额(持仓) POST /future/account/balance/list
export const getBalanceList = data => request({
  url: `/future/account/balance/list`,
  method: 'post',
  data
})
// 已平仓位 POST /contract/closedposition
export const getClosedpositionList = data => request({
  url: `/contract/closedposition`,
  method: 'post',
  data
})
// 当前委托 POST /contract/activeorders 参数user_id page size
export const getActiveorders = data => request({
  url: `/contract/activeorders`,
  method: 'post',
  data
})
// 止损委托 POST /contract/activetriggers 参数user_id page size
export const getActivetriggers = data => request({
  url: `/contract/activetriggers`,
  method: 'post',
  data
})
// 委托历史 POST /contract/orderhistory 参数user_id currency （非必传）默认全部 其他：BTCUSD/BHDUSD page size
export const getActiveOrderhistory = data => request({
  url: `/contract/orderhistory`,
  method: 'post',
  data
})
// 已成交 POST /future/account/orderfills
export const getActiveOrderfills = data => request({
  url: `/future/account/orderfills`,
  method: 'post',
  data
})
// 已成交 soket
export const WSURL = 'wss://wss.ixex.pro/v1'

// 已成交 POST /account/currency/rates
export const getRates = data => request({
  url: `/account/currency/rates`,
  method: 'post',
  data
})
/* 下单 POST /contract/order
user_id
amount
price
type 下单类型 1 限价 2市价 3限价止损 4市价止损 5限价止盈 6市价止盈
side 方向 2卖 1买
symbol 交易对
leverage 杠杆倍数 -1代表全仓 10 20 100
passive 是否被动委托 0否 1是
trigger_price 触发价格
trigger_type 触发类型 0默认 1盘口价格 2标记价格 3指数价格
trigger_close 触发后平仓 0未勾选 1勾选
tp_type 止盈触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
tp_price 止盈价格
sl_type 止损触发类型 0默认 1盘口价格 2标记价格 3指数价格 如果是-1的话代表从仓位里下的触发单
sl_price 止损价格 */
export const submitOrder = data => request({
  url: `/contract/order`,
  method: 'post',
  data
})

// 当前仓位,委托,止损委托,委托历史,已成交数量 POST /future/account/holding/amount
export const getAllAmount = data => request({
  url: `/future/account/holding/amount`,
  method: 'post',
  data
})
