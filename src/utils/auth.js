import Cookies from 'js-cookie'
const { token } = window.laravel
const TokenKey = 'Admin-Token'

export function getToken() {
  return token
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log(token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
