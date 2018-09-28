import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'carousel',
    method: 'get',
    params: query
  })
}

export function createCarousel(data) {
  return request({
    url: 'carousel',
    method: 'post',
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: 'carousel/' + data.id,
    method: 'put',
    data
  })
}

export function deleteCarousel(data) {
  return request({
    url: 'carousel/' + data.id,
    method: 'delete'
  })
}


