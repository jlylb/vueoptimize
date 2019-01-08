import request from '@/utils/request'

export function getQrcode() {
  return request({
    url: 'qrcode',
    method: 'get'
  })
}

export function checkQrcode(data) {
  return request({
    url: 'checkQruuid',
    method: 'get',
    params: data
  })
}
