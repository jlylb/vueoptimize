import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'data',
    method: 'get',
    params: query
  })
}

