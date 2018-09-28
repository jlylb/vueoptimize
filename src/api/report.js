import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'report',
    method: 'get',
    params: query
  })
}

export function historysum(query) {
  return request({
    url: 'report/historysum',
    method: 'get',
    params: query
  })
}

export function assetsum(query) {
  return request({
    url: 'report/assetsum',
    method: 'get',
    params: query
  })
}
