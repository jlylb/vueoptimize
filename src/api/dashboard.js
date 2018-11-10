import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'dashboard',
    method: 'get',
    params: query
  })
}

