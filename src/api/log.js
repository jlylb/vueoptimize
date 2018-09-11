import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'userlog',
    method: 'get',
    params: query
  })
}
