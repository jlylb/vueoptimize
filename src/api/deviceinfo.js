import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'deviceinfo',
    method: 'get',
    params: query
  })
}

export function createDeviceinfo(data) {
  return request({
    url: 'deviceinfo',
    method: 'post',
    data
  })
}

export function updateDeviceinfo(data) {
  return request({
    url: 'deviceinfo/' + data.pdi_index,
    method: 'put',
    data
  })
}

export function deleteDeviceinfo(data) {
  return request({
    url: 'deviceinfo/' + data.pdi_index,
    method: 'delete'
  })
}

export function fetchAllTypes() {
  return request({
    url: 'deviceinfo/devicetype/all',
    method: 'get'
  })
}

export function fetchAreas(id) {
  return request({
    url: 'deviceinfo/' + id + '/area',
    method: 'get'
  })
}

