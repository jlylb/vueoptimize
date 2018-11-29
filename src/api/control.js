import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/monitor/index',
    method: 'get',
    params: { ...query, mtype: 2 }
  })
}

export function fetchAreaDevice(params) {
  const data = { ...params, mtype: 2 }
  return request({
    url: '/monitor/areadevice',
    method: 'post',
    data
  })
}

export function fetchDeviceData(data) {
  return request({
    url: '/control/devicedata',
    method: 'get',
    params: data
  })
}

export function saveCommand(data) {
  return request({
    url: '/control/command',
    method: 'post',
    params: data
  })
}
export function saveSwitch(data) {
  return request({
    url: '/control/switch',
    method: 'post',
    params: data
  })
}
export function saveOut(data) {
  return request({
    url: '/control/out',
    method: 'post',
    params: data
  })
}
