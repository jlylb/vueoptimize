import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'monitor/index',
    method: 'get',
    params: query
  })
}
