import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'menu',
    method: 'get',
    params: query
  })
}

export function fetchNotice(id) {
  return request({
    url: '/notice/detail',
    method: 'get',
    params: { id }
  })
}

export function createMenu(data) {
  return request({
    url: 'menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: 'menu/' + data.id,
    method: 'put',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: 'menu/' + data.id,
    method: 'delete',
    params: data
  })
}

export function fetchAllMenu() {
  return request({
    url: 'menu/create',
    method: 'get'
  })
}

export function fetchMenu(id) {
  return request({
    url: 'menu/' + id,
    method: 'get'
  })
}

export function createButtons(id, data) {
  return request({
    url: 'menu/' + id + '/buttons',
    method: 'post',
    data
  })
}
