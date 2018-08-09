import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/notice/index',
    method: 'get',
    params: query
  })
}

export function fetchNotice(id) {
  return request({
    url: '/notice/detail',
    method: 'get',
    params: { id }
  })
}

export function createNotice(data) {
  return request({
    url: '/notice/create',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/update',
    method: 'putch',
    data
  })
}

export function deleteNotice(data) {
  return request({
    url: '/notice/delete',
    method: 'delete',
    params: data
  })
}
