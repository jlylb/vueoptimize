import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'flash',
    method: 'get',
    params: query
  })
}

export function createCarousel(data) {
  return request({
    url: 'flash',
    method: 'post',
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: 'flash/' + data.id,
    method: 'put',
    data
  })
}

export function deleteCarousel(data) {
  return request({
    url: 'flash/' + data.id,
    method: 'delete'
  })
}


