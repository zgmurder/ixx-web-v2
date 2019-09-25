import Cookies from 'js-cookie'

const userKey = 'user'
const sessionKey = 'ix_session_id'

export function setUser(userdata) {
  return Cookies.set(userKey, userdata)
}
export function getUser() {
  return Cookies.get(userKey)
}
export function removeUser() {
  return Cookies.remove(userKey)
}

export function setSession(sessionId) {
  return Cookies.set(sessionKey, sessionId)
}
export function getSession() {
  return Cookies.get(sessionKey)
}
export function removeSession() {
  return Cookies.remove(sessionKey)
}

