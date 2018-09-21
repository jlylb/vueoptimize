import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'warndefine',
    method: 'get',
    params: query
  })
}

export function createWarnDefine(data) {
  return request({
    url: 'warndefine',
    method: 'post',
    data
  })
}

export function updateWarnDefine(data) {
  return request({
    url: 'warndefine/' + data.wd_index,
    method: 'put',
    data
  })
}

export function deleteWarnDefine(data) {
  return request({
    url: 'warndefine/' + data.wd_index,
    method: 'delete'
  })
}

export function fetchDetail(query) {
  return request({
    url: 'warndefine/' + query.wd_index,
    method: 'get'
  })
}
