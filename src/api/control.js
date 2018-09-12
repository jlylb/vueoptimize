import request from '@/utils/request'

export function updateStatus(data) {
  return request({
    url: 'control/' + data.pdi_index + '/update',
    method: 'post',
    data
  })
}

export function fetchDevice(query) {
  return request({
    url: 'control/device',
    method: 'get',
    params: query
  })
}
