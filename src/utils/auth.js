import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userKey = 'user'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUser(userdata) {
  return Cookies.set(userKey, userdata)
}
export function getUser() {
  return Cookies.get(userKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
