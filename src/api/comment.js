import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'comment',
    method: 'get',
    params: query
  })
}

export function createComment(data) {
  return request({
    url: 'comment',
    method: 'post',
    data
  })
}

export function updateComment(data) {
  return request({
    url: 'comment/' + data.id,
    method: 'put',
    data
  })
}

export function deleteComment(data) {
  return request({
    url: 'comment/' + data.id,
    method: 'delete'
  })
}


