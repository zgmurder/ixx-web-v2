import Big from 'big.js/big.mjs'
export const logogramNum = num => {
  const numberObj = Big(num)
  if (numberObj.e > 6) {
    return numberObj.c.slice(0, numberObj.e - 5).join('') + ' M '
  } else {
    return num
  }
}
const handler = (dataArr, fixed, type) => {
  const res = dataArr.reduce((curr, prev) => Big(curr)[type](prev))
  return bigRound(res, fixed)
}
export const bigRound = (target, fixed = 1, rm = 0) => Big(target).round(fixed, rm).toFixed(fixed < 0 ? 0 : fixed)

export const bigDiv = ([source, rate], fixed) => bigRound(Big(source).div(rate), fixed)

export const bigTimes = (dataArr, fixed) => handler(dataArr, fixed, 'times')

export const bigPlus = (dataArr, fixed) => handler(dataArr, fixed, 'plus')

export const bigMinus = (dataArr, fixed) => handler(dataArr, fixed, 'minus')

/*
  { 开平仓费率：后台返回take_rate ，IM百分比：当前档位，合约乘数：后台返回multiplier BTC为1，合约数量：合约乘数 * 合约数量}

  成本 = 起始保证 + 开平仓手续费
  起始保证金 = 委托价值 / 当前杠杆倍数 *（1 + IM百分比）
  委托价值 = 合约数量 / 成交价格
  开平仓手续费 = 委托价值 * 开平仓费率

  成本 = 委托价值 / 当前杠杆倍数 *（1 + IM百分比） + 开平仓手续费
*/
export const getCost = ({ count = 0, price = 1, leverages = 1, IM = 0, take_rate = 0.0007, fixed = 8 }) => {
  const entrustValue = Big(count).div(price)
  const serviceCharge = entrustValue.times(take_rate).times(2)
  if (!count) return Big(0).toFixed(fixed)
  return entrustValue.div(leverages).times(+IM + 1).plus(serviceCharge).toFixed(fixed)
}
