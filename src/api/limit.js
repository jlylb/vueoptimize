import request from '@/utils/request'

export function fetchDeviceData(data) {
  return request({
    url: '/limit/index',
    method: 'get',
    params: data
  })
}

export function saveCommand(data) {
  return request({
    url: '/limit/command',
    method: 'post',
    data
  })
}
