import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 40

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    created_at: Mock.Random.now(),
    name: '@cname',
    message: Mock.Random.csentence(),
    'status|1': [1, 2, 3, 4, 5]
  }))
}

export default {
  getList: config => {
    const { name, status, page = 1, pageSize = 10, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      if (status && status !== item.status) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },

  getNotice: (config) => {
    const { id } = param2Obj(config.url)
    for (const permission of List) {
      if (permission.id === +id) {
        return permission
      }
    }
  },
  createNotice: () => ({
    data: 'success'
  }),
  updateNotice: () => ({
    data: 'success'
  }),
  deleteNotice: () => ({
    data: 'success'
  })
}
