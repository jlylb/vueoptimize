import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'notification',
    method: 'get',
    params: query
  })
}



export function deleteNotification(data) {
  return request({
    url: 'notification/' + data.id,
    method: 'delete',
    data
  })
}

export function readNotification(data) {
  return request({
    url: 'notification/' + data.id + '/unread',
    method: 'post',
    data
  })
}

export function readAllNotification(data) {
  return request({
    url: 'notification/unreadall',
    method: 'post',
    data
  })
}
