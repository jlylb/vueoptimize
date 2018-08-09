import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import permissionAPI from './permission'
import rolesAPI from './roles'
import userAPI from './users'
import noticeAPI from './notice'

import logoAPI from './upload'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 文章相关
Mock.mock(/\/privillege\/permission/, 'get', permissionAPI.getList)
Mock.mock(/\/privillege\/permission\/detail/, 'get', permissionAPI.getPermission)
Mock.mock(/\/privillege\/permission\/create/, 'post', permissionAPI.createPermission)
Mock.mock(/\/privillege\/permission\/update/, 'post', permissionAPI.updatePermission)

Mock.mock(/\/privillege\/roles/, 'get', rolesAPI.getList)
Mock.mock(/\/privillege\/role\/detail/, 'get', rolesAPI.getPermission)
Mock.mock(/\/privillege\/role\/create/, 'post', rolesAPI.createPermission)
Mock.mock(/\/privillege\/role\/update/, 'post', rolesAPI.updatePermission)

Mock.mock(/\/privillege\/users/, 'get', userAPI.getList)
Mock.mock(/\/privillege\/user\/detail/, 'get', userAPI.getPermission)
Mock.mock(/\/privillege\/user\/create/, 'post', userAPI.createPermission)
Mock.mock(/\/privillege\/user\/update/, 'putch', userAPI.updatePermission)

Mock.mock(/\/notice\/index/, 'get', noticeAPI.getList)
Mock.mock(/\/notice\/detail/, 'get', noticeAPI.getNotice)
Mock.mock(/\/notice\/create/, 'post', noticeAPI.createNotice)
Mock.mock(/\/notice\/update/, 'putch', noticeAPI.updateNotice)
Mock.mock(/\/notice\/delete/, 'delete', noticeAPI.deleteNotice)

Mock.mock(/\/upload\/detail/, 'get', logoAPI.getLogo)
Mock.mock(/\/upload\/create/, 'post', logoAPI.createLogo)

export default Mock
