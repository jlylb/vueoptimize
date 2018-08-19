import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'post',
    method: 'get',
    params: query
  })
}


export function createPost(data) {
  return request({
    url: 'post',
    method: 'post',
    data
  })
}

export function updatePost(data) {
  return request({
    url: 'post/' + data.id,
    method: 'put',
    data
  })
}

export function deletePost(data) {
  return request({
    url: 'post/' + data.id,
    method: 'delete'
  })
}

