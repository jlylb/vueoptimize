import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'area',
    method: 'get',
    params: query
  })
}

export function createArea(data) {
  return request({
    url: 'area',
    method: 'post',
    data
  })
}

export function updateArea(data) {
  return request({
    url: 'area/' + data.AreaId,
    method: 'put',
    data
  })
}

export function deleteArea(data) {
  return request({
    url: 'area/' + data.AreaId,
    method: 'delete'
  })
}

