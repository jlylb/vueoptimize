import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'warnnotify',
    method: 'get',
    params: query
  })
}

export function createItem(data) {
  return request({
    url: 'warnnotify',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: 'warnnotify/' + data.wn_index,
    method: 'put',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: 'warnnotify/' + data.wn_index,
    method: 'delete'
  })
}
