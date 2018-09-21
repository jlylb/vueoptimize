import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'warnuser',
    method: 'get',
    params: query
  })
}

export function createItem(data) {
  return request({
    url: 'warnuser',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: 'warnuser/' + data.wu_index,
    method: 'put',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: 'warnuser/' + data.wu_index,
    method: 'delete'
  })
}
