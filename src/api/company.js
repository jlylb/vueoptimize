import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'company',
    method: 'get',
    params: query
  })
}

export function fetchCompany(id) {
  return request({
    url: 'company/' + id,
    method: 'get'
  })
}

export function createCompany(data) {
  return request({
    url: 'company',
    method: 'post',
    data
  })
}

export function updateCompany(data) {
  return request({
    url: 'company/' + data.Co_ID,
    method: 'put',
    data
  })
}

export function deleteCompany(data) {
  return request({
    url: 'company/' + data.Co_ID,
    method: 'delete'
  })
}

export function searchCompany(id) {
  return request({
    url: 'company/' + id + '/search',
    method: 'get'
  })
}
