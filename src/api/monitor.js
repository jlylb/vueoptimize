import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'monitor/index',
    method: 'get',
    params: query
  })
}

export function fetchDevice(query) {
  return request({
    url: 'monitor/device',
    method: 'get',
    params: query
  })
}

export function fetchDeviceData(data) {
  return request({
    url: 'monitor/data',
    method: 'post',
    data
  })
}

export function fetchDeviceRealData(data) {
  return request({
    url: 'monitor/realdata',
    method: 'post',
    data
  })
}
