import { param2Obj } from '@/utils'
import Mock from 'mockjs'
// import Layout from '@/views/layout/Layout'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    company_name: '盛世奈特管理系统',
    company_logo: Mock.Random.dataImage('180x80', 'LOGO'),
    routes: [
      {
        path: '/permission',
        component: 'layout/Layout',
        redirect: '/permission/index',
        alwaysShow: true, // will always show the root menu
        meta: {
          title: 'permission',
          icon: 'lock',
          roles: ['admin', 'editor'] // you can set roles in root nav
        },
        children: [{
          path: 'permission',
          component: 'permission/permission',
          name: 'permissionList',
          meta: {
            title: 'permissionList'
            // if do not set roles, means: this page does not require permission
          }
        }, {
          path: 'role',
          component: 'permission/roles',
          name: 'rolesList',
          meta: {
            title: 'rolesList'
            // if do not set roles, means: this page does not require permission
          }
        }, {
          path: 'user',
          component: 'permission/users',
          name: 'usersList',
          meta: {
            title: 'usersList'
            // if do not set roles, means: this page does not require permission
          }
        }, {
          path: 'profile',
          component: 'permission/profile',
          name: 'profile',
          hidden: true,
          meta: {
            title: '个人中心'
            // if do not set roles, means: this page does not require permission
          }
        }, {
          path: 'password',
          component: 'permission/password',
          name: 'password',
          hidden: true,
          meta: {
            title: '修改密码'
            // if do not set roles, means: this page does not require permission
          }
        }, {
          path: 'role_ability/:role',
          component: 'permission/ability',
          name: 'permission_role_ability',
          hidden: true,
          meta: {
            title: '角色权限'
            // if do not set roles, means: this page does not require permission
          }
        }]
      },
      {
        path: '/charts',
        component: 'layout/Layout',
        redirect: 'noredirect',
        name: 'charts',
        meta: {
          title: 'charts',
          icon: 'chart'
        },
        children: [
          { path: 'keyboard', component: 'charts/keyboard', name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
          { path: 'line', component: 'charts/line', name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
          { path: 'mixchart', component: 'charts/mixChart', name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
        ]
      }, {
        path: '/menu',
        component: 'layout/Layout',
        redirect: '/menu/index',
        name: 'menu',
        meta: {
          title: 'menu',
          icon: 'chart'
        },
        children: [
          { path: 'index', component: 'menu/index', name: 'menu_index', meta: { title: 'menu', noCache: true }}
        ]
      },
      { path: '*', redirect: '/404', hidden: true }

    ]
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    company_name: '盛世奈特管理系统',
    company_logo: Mock.Random.dataImage('180x80', 'LOGO'),
    routes: [
      {
        path: '/charts',
        component: 'layout/Layout',
        redirect: 'noredirect',
        name: 'charts',
        meta: {
          title: 'charts',
          icon: 'chart'
        },
        children: [
          { path: 'keyboard', component: 'charts/keyboard', name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
          { path: 'line', component: 'charts/line', name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
          { path: 'mixchart', component: 'charts/mixChart', name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
        ]
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
