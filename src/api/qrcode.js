import request from '@/utils/request'

export function getQrcode() {
  return request({
    baseURL: '',
    url: '/lapi/qrcode',
    method: 'get'
  })
}

export function checkQrcode(data) {
  return request({
    baseURL: '',
    url: '/lapi/checkQruuid',
    method: 'get',
    params: data
  })
}
