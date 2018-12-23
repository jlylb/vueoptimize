import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm/detail',
    hidden: true,
    children: [{
      path: 'detail',
      component: () => import('@/views/alarm/detail'),
      name: 'alarm_detail',
      meta: { title: 'detail', icon: 'detail' }
    }]
  },
  {
    path: '/flash',
    component: Layout,
    redirect: '/flash/index',
    hidden: true,
    children: [{
      path: 'index/:cid',
      component: () => import('@/views/flash/index'),
      name: 'api.flash.index',
      meta: { title: 'flash', icon: 'flash' }
    }]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/notice/index'),
      name: 'notice_index',
      meta: { title: '消息中心', icon: 'message' }
    }]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/device/index'),
      name: 'device_index',
      meta: { title: '设备实时图', icon: 'running' }
    },

    {
      path: 'detail',
      component: () => import('@/views/device/detail'),
      name: 'device_detail',
      meta: { title: '设备详情', icon: 'running' }
    }]
  }

]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
