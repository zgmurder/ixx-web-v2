import Big from 'big.js/big.mjs'
export const logogramNum = num => {
  const numberObj = Big(num)
  if (numberObj.e > 6) {
    return numberObj.c.slice(0, numberObj.e - 5).join('') + ' M张'
  } else {
    return num
  }
}

export const bigRound = (target, fixed = 1, rm = 0) => Big(target).round(fixed, rm).toFixed(fixed)

export const bigDiv = ([source, rate], fixed) => bigRound(Big(source).div(rate), fixed)

export const bigTimes = (dataArr, fixed) => {
  const res = dataArr.reduce((curr, prev) => {
    return Big(curr).times(prev)
  })
  return bigRound(res, fixed)
}
