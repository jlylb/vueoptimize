import request from '@/utils/request'

export function fetchDevice(query) {
  return request({
    url: 'alarm/device',
    method: 'get',
    params: query
  })
}
