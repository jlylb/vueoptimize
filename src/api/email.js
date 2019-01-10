import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'system/index',
    method: 'get',
    params: query
  })
}

export function saveEmail(data) {
  return request({
    url: 'system/store',
    method: 'post',
    data
  })
}

export function sendEmail(data) {
  return request({
    url: 'system/testsend',
    method: 'post',
    data
  })
}

export function saveSms(data) {
  return request({
    url: 'system/storesms',
    method: 'post',
    data
  })
}

export function sendSms(data) {
  return request({
    url: 'system/testsendsms',
    method: 'post',
    data
  })
}
