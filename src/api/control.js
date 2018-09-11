import request from '@/utils/request'

export function updateStatus(data) {
  return request({
    url: 'control/' + data.pdi_index + '/update',
    method: 'post',
    data
  })
}
