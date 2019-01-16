import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'apk',
    method: 'get',
    params: query
  })
}

export function createApk(data) {
  return request({
    url: 'apk',
    method: 'post',
    data
  })
}

export function updateApk(data) {
  return request({
    url: 'apk/' + data.id,
    method: 'put',
    data
  })
}

export function deleteApk(data) {
  return request({
    url: 'apk/' + data.id,
    method: 'delete'
  })
}
