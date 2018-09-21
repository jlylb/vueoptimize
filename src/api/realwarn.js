import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'realwarn',
    method: 'get',
    params: query
  })
}

export function fetchDetail(data) {
  return request({
    url: 'realwarn/detail',
    method: 'get',
    params: data
  })
}
