import { constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const _import = require('@/utils/_import_development')

function genRoutes(routes) {
  routes.forEach((item) => {
    if (item.component && typeof item.component === 'string') {
      item.component = _import(item.component)
    }
    if (item.meta && item.buttons) {
      item.meta = Object.assign(item.meta, JSON.parse(item.buttons))
    }
    if (item.children && item.children.length > 0) {
      item.children = genRoutes(item.children)
    }
  })
  return routes
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    abilities: [],
    meta: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ABILITIES: (state, abilities) => {
      state.abilities = abilities
    },
    SET_META: (state, meta) => {
      state.meta = meta
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const routes = genRoutes(data.routes)
        const notFound = { path: '*', redirect: '/404', hidden: true }
        routes.push(notFound)
        commit('SET_ROUTERS', routes)
        commit('SET_ABILITIES', data.ability)
        resolve()
      })
    }
  }
}

export default permission
