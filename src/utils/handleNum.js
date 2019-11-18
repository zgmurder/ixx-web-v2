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

export const calcTotalValue = ({ entrustList, holding = { amount: 0, price: 0, side: 1 }, multiplier },) => {
  let holdingValue = Big(0)
  if (!holding[0] || !holding[1] || !+holding[1] || !+holding[0]) {
    holdingValue = Big(0)
  } else {
    holdingValue = calcValue(holding.amount, holding.price, multiplier)
  }
  entrustList = !entrustList ? [] : entrustList

  let _holdingValue = Big(_holdingValue)
  const entrustValue = entrustList.reduce((prev, curr) => {
    const remainAmount = Big(curr.amount).minus(curr.executed)
    const entrustValue = calcValue(remainAmount, curr.price, multiplier)
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
  let totalValue = calcTotalValue({ entrustList, currHolding, multiplier })
  totalValue = (totalValue == null || totalValue.eq(0)) ? currValue : totalValue
  console.log({ totalValue })
  const num = (Big(totalValue).minus(base_risk)).div(gap_risk).round(0, 3)

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
export const getTotalValue = ({ futures, holding, pairInfo, mul, fixed = 8 }) => {
  const down = 0
  const price = holding.price === '--' ? 0 : holding.price

  let totalValue = Big(price || 0).eq(0) ? Big(0) : Big(holding.amount).div(price)
  if (pairInfo.name !== 'FUTURE_BTCUSD') {
    totalValue = Big(holding.amount || 0).times(price || 0).times(mul)
  }
  for (const future of futures) {
    // 数量 = 委托总数量 - 已成交数量
    const fprice = future.price === '--' ? 0 : future.price
    const amount = Big(future.amount).minus(future.executed)
    let value = Big(fprice || 0).eq(0) ? Big(0) : amount.div(fprice)
    if (pairInfo.name !== 'FUTURE_BTCUSD') {
      value = Big(future.amount || 0).times(fprice || 0).times(mul)
    }
    totalValue = future.side === 1 ? totalValue.plus(value) : totalValue.minus(value)
  }
  return totalValue.round(fixed, down).abs()
}

/** 盈亏计算
 * direction 多空方向 less空 more多
 * leverages 杠杆倍数
 * amount 下单数量
 * open_price 开仓价格
 * close_price 平仓价格
 * product 币对属性
*/
export const getProfitLoss = ({ direction, leverages, amount, open_price, close_price, product }) => {
  if (direction === 'less') {
    amount = -amount
  }
  if (leverages == 0) {
    leverages = product.max_leverage
  }
  let open_value = Big(0)
  let close_value = Big(0)

  if (product.product_name === 'BTC') {
    open_value = Big(amount).div(open_price || 1).abs()
    close_value = Big(close_price).div(open_price || 1).mul(open_value).abs()
  } else {
    open_value = Big(amount || 0).times(open_price || 0).times(product.multiplier).abs()
    close_value = Big(amount || 0).times(close_price || 0).times(product.multiplier).abs()
  }

  const margin = Big(open_value).mul(product.max_leverage).div(leverages || product.max_leverage).mul(product.im).abs()
  const realized = close_value.minus(open_value).mul(amount < 0 ? -1 : 1)
  const realized_roe = realized.div(open_value || 1).mul(100)
  const roe = realized_roe.mul(leverages)

  return {
    open_value, // 开仓价值
    close_value, // 平仓价值
    margin, // 保证金
    realized, // 以实现盈亏
    realized_roe, // 盈亏比例
    roe // 回报率
  }
}

// 风险限额及最大杠杆倍数
export const riskLimitDict = (maxLeverage) => {
  if (maxLeverage == 100) {
    return [
      { r: 0, m: 100 },
      { r: 200, m: 100 },
      { r: 300, m: 66.66 },
      { r: 400, m: 50 },
      { r: 500, m: 40 },
      { r: 600, m: 33.33 },
      { r: 700, m: 28.5 },
      { r: 800, m: 25 },
      { r: 900, m: 22.22 },
      { r: 1000, m: 20 },
      { r: 1100, m: 18.1 }
    ]
  } else if (maxLeverage == 50) {
    return [
      { r: 0, m: 50 },
      { r: 50, m: 50 },
      { r: 100, m: 33.3 },
      { r: 150, m: 25 },
      { r: 200, m: 20 },
      { r: 250, m: 16.6 },
      { r: 300, m: 14.2 },
      { r: 350, m: 12.5 },
      { r: 400, m: 11.1 },
      { r: 450, m: 10 },
      { r: 500, m: 9 }
    ]
  } else if (maxLeverage == 20) {
    return [
      { r: 0, m: 20 },
      { r: 50, m: 20 },
      { r: 100, m: 10 },
      { r: 150, m: 6.6 },
      { r: 200, m: 5 },
      { r: 250, m: 4 },
      { r: 300, m: 3.3 },
      { r: 350, m: 2.8 },
      { r: 400, m: 2.5 },
      { r: 450, m: 2.2 },
      { r: 500, m: 2 }
    ]
  } else {
    return []
  }
}

// 强平价格
/**
 * direction 多空方向 less空 more多
 * leverages 杠杆倍数
 * amount 下单数量
 * open_price 开仓价格
 * price_scale 价格小数位
 * isCross 是否是全仓
 * multiplier 乘数
 * take_rate 手续费率
*/
export const getLiqPrice = ({ direction, leverages, amount, open_price, price_scale, isCross, multiplier, take_rate }, holding, symbol) => {
  const current = holding.holding || 0 // 持仓量
  let force_price = '0'
  if (open_price == 0 || amount == 0) {
    return {
      current, // 当前持仓量
      new_amount: amount, // 新的持仓量
      force_price: '--' // 强平价格
    }
  }

  if (leverages === 0) {
    leverages = symbol.max_leverage
  }

  if (symbol.product_name === 'BTC') {
    const value = Big(amount).div(open_price)
    const im = Big(value).mul(symbol.max_leverage / leverages).mul(symbol.im)
    const mm = Big(value).mul(symbol.mm)
    const available = holding.available_balance

    let result = Big(open_price).mul(amount)
    let imDiff = Big(im - mm)
    if (isCross) {
      // 全仓--空仓Lp=open_price*amount/[amount-(可用余额+IM-MM)*open_price*（1-R）]
      imDiff = imDiff.plus(available)
    }
    // 空仓
    if (direction === 'less') {
      result = result.div(Big(amount).minus(imDiff.mul(open_price).mul(1 - Number(take_rate || 0))))
      // 如果result小于0， 强平价格无限大
      if (result.lt(0)) {
        force_price = '999999'
      } else {
        force_price = result.round(price_scale || 4).toString()
      }
    } else {
      result = result.div(Big(amount).plus(imDiff.mul(open_price).mul(1 - Number(take_rate || 0))))
      if (result.lt(0)) {
        force_price = '--'
      } else {
        force_price = result.round(price_scale || 4).toString()
      }
    }
    if (Big(force_price || 0).lt(0)) {
      force_price = Big(0)
    }
  } else {
    const value = Big(multiplier).times(amount).times(open_price)
    const im = value.div(leverages).times(Big(1).plus(symbol.im))
    const mm = Big(symbol.mm).times(value)
    const mulvol = multiplier.times(amount)
    const imDiff = im.minus(mm)
    const fee = Big(take_rate).times(value)
    // 全仓
    if (isCross) {
      const avia = Big(holding.available_balance).minus(fee).minus(im)
      // 空单
      if (direction === 'less') {
        force_price = (value.plus(imDiff).plus(avia)).div(mulvol)
      }
      // 多单
      else {
        force_price = (value.minus(imDiff).minus(avia)).div(mulvol)
      }
    } else {
      // 空单
      if (direction === 'less') {
        force_price = (value.plus(imDiff)).div(mulvol)
      }
      // 多单
      else {
        force_price = (value.minus(imDiff)).div(mulvol)
      }
    }
    if (Big(force_price || 0).lt(0)) {
      force_price = Big(0)
    }
  }
  const new_amount = Number(current) + Number(amount * (direction === 'less' ? -1 : 1))
  return {
    current, // 当前持仓量
    new_amount, // 新的持仓量
    force_price // 强平价格
  }
}
