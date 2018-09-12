import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'warnclass',
    method: 'get',
    params: query
  })
}

export function createWarnClass(data) {
  return request({
    url: 'warnclass',
    method: 'post',
    data
  })
}

export function updateWarnClass(data) {
  return request({
    url: 'warnclass/' + data.wc_index,
    method: 'put',
    data
  })
}

export function deleteDeviceinfo(data) {
  return request({
    url: 'warnclass/' + data.wc_index,
    method: 'delete'
  })
}
