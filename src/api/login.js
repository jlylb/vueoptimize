import request from '@/utils/request'

// export function loginByUsername(username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }

// export function logout() {
//   return request({
//     url: '/login/logout',
//     method: 'post'
//   })
// }

// export function getUserInfo(token) {
//   return request({
//     url: 'auth/me',
//     method: 'get',
//     params: { token }
//   })
// }

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: 'auth/userinfo',
    method: 'get'
  })
}
export function saveUserInfo(data) {
  return request({
    url: 'auth/userinfo',
    method: 'put',
    data
  })
}

export function modifyPassword(data) {
  return request({
    url: 'auth/password',
    method: 'put',
    data
  })
}

