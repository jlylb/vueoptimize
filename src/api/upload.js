import request from '@/utils/request'

export function fetchLogo() {
  return request({
    url: '/upload/detail',
    method: 'get'
  })
}

export function createLogo(data) {
  return request({
    url: 'upload',
    method: 'post',
    data
  })
}
