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
      return n.slice(0, leng % 3) + n.slice(len % 3).replace(/(\d{3})/g, ',$1')
    }

  })
}

export const toDiv = (numA, numB) => {
  if (isNaN(Number(numA)) || isNaN(Number(numB))) {
    return 0
  }
  return Big(numA).div(numB).toString()
}

export const toTimes = (numA, numB) => {
  if (isNaN(Number(numA)) || isNaN(Number(numB))) {
    return 0
  }
  return Big(numA).times(numB).toString()
}

export const toPlus = (numA, numB) => {
  if (isNaN(Number(numA)) || isNaN(Number(numB))) {
    return 0
  }
  return Big(numA).plus(numB).toString()
}

export const toMinus = (numA, numB) => {
  if (isNaN(Number(numA)) || isNaN(Number(numB))) {
    return 0
  }
  return Big(numA).minus(numB).toString()
}


