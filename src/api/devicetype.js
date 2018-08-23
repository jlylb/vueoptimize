import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'devicetype',
    method: 'get',
    params: query
  })
}

export function createDevicetype(data) {
  return request({
    url: 'devicetype',
    method: 'post',
    data
  })
}

export function updateDevicetype(data) {
  return request({
    url: 'devicetype/' + data.dt_index,
    method: 'put',
    data
  })
}

export function deleteDevicetype(data) {
  return request({
    url: 'devicetype/' + data.dt_index,
    method: 'delete'
  })
}

