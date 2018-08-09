import Mock from 'mockjs'

export default {
  getLogo: () => {
    return [{
      name: Mock.Random.title(),
      url: Mock.Random.dataImage('100x100', 'get logo')
    }]
  },
  createLogo: () => ({
    name: Mock.Random.title(),
    url: Mock.Random.dataImage('100x100', 'create logo')
  })
}
