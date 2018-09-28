import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'video',
    method: 'get',
    params: query
  })
}
