import Big from 'big.js/big.mjs'
export const logogramNum = num => {
  const numberObj = Big(num)
  if (numberObj.e > 6) {
    return numberObj.c.slice(0, numberObj.e - 5).join('') + ' M '
  } else {
    return num
  }
}
const handler = (dataArr, fixed = 8, type) => {
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

export const bigRound = (target, fixed, rm = 0) => Big(target || 0).round(fixed, rm).toFixed(fixed < 0 ? 0 : fixed)

export const bigDiv = (dataArr, fixed) => handler(dataArr, fixed, 'div')

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
  总价值 = 仓位价值 + 委托列表价值（对冲仓位）
*/
/**
 * getCost
 * @param {Array} entrustList
 * @param {Array [amount,price]} holding
 */
export const calcValueByAmountAndPrice = (amount, price, multiplier) => {
  if (!amount || !+amount || !price || !+price) return 0
  else return !+multiplier ? Big(amount).div(price) : Big(multiplier).times(price).times(amount)
}

export const calcTotalValue = ({ entrustList, holding = { amount: 0, price: 0, side: 1 }, mul }) => {
  if (!holding[0] || !holding[1] || !+holding[1] || !+holding[0]) return 0
  const holdingValue = calcValue(holding.amount, holding.price, mul)
  let _holdingValue = Big(_holdingValue)
  const entrustValue = entrustList.reduce((prev, curr) => {
    const remainAmount = Big(curr.amount).minus(curr.executed)
    const entrustValue = calcValue(remainAmount, curr.price, mul)
    if (curr.side !== holding.side && _holdingValue.gte(0)) {
      _holdingValue = _holdingValue.minus(entrustValue)
      return _holdingValue.abs().plus(prev)
    } else return holdingValue.plus(entrustValue).plus(prev)
  }, 0)
  return holdingValue.plus(entrustValue)
  // const down = 0
  // const price = holding.price === '--' ? 0 : holding.price

  // let totalValue = Big(price || 0).eq(0) ? Big(0) : Big(holding.amount).div(price)
  // if (pairInfo.name !== 'FUTURE_BTCUSD') {
  //   totalValue = Big(holding.amount || 0).times(price || 0).times(mul)
  // }
  // for (const future of futures) {
  //   // 数量 = 委托总数量 - 已成交数量
  //   const fprice = future.price === '--' ? 0 : future.price
  //   const amount = Big(future.amount).minus(future.executed)

  //   let value = Big(fprice || 0).eq(0) ? Big(0) : amount.div(fprice)
  //   if (pairInfo.name !== 'FUTURE_BTCUSD') {
  //     value = Big(future.amount || 0).times(fprice || 0).times(mul)
  //   }
  //   totalValue = future.side === 1 ? totalValue.plus(value) : totalValue.minus(value)
  // }
  // return totalValue.round(fixed, down).abs()
}

/*
  { 开平仓费率：后台返回take_rate ，IM百分比：当前档位，合约乘数：后台返回multiplier BTC为1，合约数量：合约乘数 * 合约数量}

  成本 = 起始保证 + 开平仓手续费
  起始保证金 = 委托价值 / 当前杠杆倍数 *（1 + IM百分比）
  委托价值 = 合约数量 / 成交价格
  开平仓手续费 = 委托价值 * 开平仓费率

  成本 = 委托价值 / 当前杠杆倍数 *（1 + IM百分比） + 开平仓手续费

  价值 = 如果是BTC ? 合约数量 / 成交价格 : 乘数 * 价格 * 数量
  总价值 = 仓位价值 + 委托列表价值（对冲仓位）
*/
/**
 * getCost
 * @param {(|string|number)} amount
 * @param {(|string|number)} price
 * @param {(|string|number)} leverages
 * @param {(|string|number)} IM
 * @param {(|string|number)} take_rate
 * @param {(|string|number)} fixed
 * @param {(|string|number)} MM
 * @returns {string|number}
 */
export const getCost = (product, leverages, entrustList, currHolding) => {
  // { amount = 0, price = 1, leverages = 1, IM = 0, take_rate = 0.0007, MM = 0, pairInfo = { mul: 0 }, totalValue = 0, fixed = 8 }
  // const entrustValue = Big(amount).div(price)
  // const serviceCharge = entrustValue.times(take_rate).times(2)
  // if (!amount) return Big(0).toFixed(fixed)
  // return entrustValue.div(leverages).times(+IM + 1).plus(serviceCharge).toFixed(fixed)

  // if (amount === 0 || price === 0) return 0 // 价格或数量为0时成本为0
  const { amount, price, base_risk, gap_risk, take_rate, mm, im, multiplier } = product

  // const base_risk = pairInfo.base_risk || 200 // 起始风险限额
  // const gap_risk = pairInfo.gap_risk || 100 // 每100BTC加一档
  // const max_leverage = pairInfo.max_leverage || 100 // 最大杠杆倍数
  // const mul = Big(pairInfo.multiplier || 0) // 乘数
  // const current_leverage = !+leverages ? max_leverage : leverages // 当前杠杆倍数

  // btc_usd的价值等于数量除以价格,其它币对的价值等于 数量 * 价格 * 乘数
  // let value = (Big(amount).div(price))
  // if (pairInfo.name !== 'FUTURE_BTCUSD') {
  //   value = mul.times(price).times(amount)
  // }

  // 输入价值
  const currValue = calcValueByAmountAndPrice(amount, price, multiplier)
  if (!currValue) return 0
  // 总价值=仓位价值+委托列表价值（对冲仓位）
  // 委托列表价值 = 当前委托列表价值+即将要下单的价值
  // totalValue = (totalValue == null || totalValue.eq(0)) ? value : totalValue

  // 累加次数 向上取整
  // const totalValue = calcTotalValue(entrustList,currHolding,multiplier)
  const num = (Big(currValue).minus(base_risk)).div(gap_risk).round(0, 3)

  const endIM = Big(im).plus(num.times(mm))

  // 平仓手续费
  const serviceCharge = currValue.times(take_rate).times(2)
  // 起始保证金
  const margin = Big(currValue).div(leverages).times(Big(1).plus(endIM)).plus(serviceCharge)
  // 成本
  return margin.plus(serviceCharge).round(8)
}

/**
   * 获取总价值
   * futures 当前委托列表 （委托列表 + 输入窗口的值）
   * holding 持仓
   * price 持仓价格
   * pair 合约类型
   */
