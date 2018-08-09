import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 3

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    'name|1': ['create charts', 'edit charts', 'delete charts', 'list charts'],
    desc: '@word',
    'router|1': ['/charts/keyboard', '/charts/line', '/charts/mixchart']
  }))
}

export default {
  getList: config => {
    const { name, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },

  getPermission: (config) => {
    const { id } = param2Obj(config.url)
    for (const permission of List) {
      if (permission.id === +id) {
        return permission
      }
    }
  },
  createPermission: () => ({
    data: 'success'
  }),
  updatePermission: () => ({
    data: 'success'
  })
}
