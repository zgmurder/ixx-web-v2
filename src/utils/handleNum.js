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

const consts = {
  ROUND_DOWN: 0,
  ROUND_HALF_UP: 1,
  ROUND_HALF_EVEN: 2,
  ROUND_UP: 3,
  DEFAULT_THEME_NAME: 'default'
}

export const bigRound = (target, fixed = 1, rm = 0) => Big(target).round(fixed, rm).toFixed(fixed < 0 ? 0 : fixed)

export const bigDiv = ([source, rate], fixed) => bigRound(Big(source).div(rate), fixed)

export const bigTimes = (dataArr, fixed) => handler(dataArr, fixed, 'times')

export const bigPlus = (dataArr, fixed) => handler(dataArr, fixed, 'plus')

export const bigMinus = (dataArr, fixed) => handler(dataArr, fixed, 'minus')

export const toBig = (num) => {
  if (typeof num === 'undefined') {
    return 0
  }
  return Big(num).toString()
}

export const toRound = (num, scale = 20, rm = consts.ROUND_DOWN) => {
  if (isNaN(Number(num))) {
    return 0
  }
  Big.NE = -20 // 当小数超过20位时使用科学计数法
  return Big(num).round(scale, rm).toString()
}

export const toFixed = (num, scale = 20, rm = consts.ROUND_DOWN) => {
  if (isNaN(Number(num))) {
    return 0
  }
  return Big(num).round(scale, rm).toFixed(scale)
}

export const toThousand = (num = 0) => {
  if (isNaN(Number(num))) {
    return 0
  }
  return (num || 0).toString().replace(/\d+/, function(n) {
    var len = n.length
    if (len % 3 === 0) {
      return n.replace(/(\d{3})/g, ',$1').slice(1)
    } else {
      return n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ',$1')
    }
  })
}

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
