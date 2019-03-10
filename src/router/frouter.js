import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/front/layout/Layout'

export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/front/home',
    children: [{
      path: '/front/home',
      component: () => import('@/front/home'),
      name: '/front/home',
      meta: { title: 'home', icon: 'home', noCache: true }
    }
    ]
  },
{ path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
