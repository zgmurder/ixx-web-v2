import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/layout/index'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: layout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index')
        }
      ]
    },
    {
      path: '/otc_trade',
      component: layout,
      name: 'otc_trade',
      children: [
        {
          path: '/otc_trade/index',
          component: () => import('@/views/otc_trade')
        }
      ]
    },
    {
      path: '/otc_trade',
      // redirect: '/home',
      component: layout,
      name: 'otc_trade',
      children: [
        {
          path: '/otc_trade/index',
          component: () => import('@/views/otc_trade')
        }
      ]
    },
    {
      path: '/otc_trade',
      // redirect: '/home',
      component: layout,
      name: 'otc_trade',
      children: [
        {
          path: '/otc_trade/index',
          component: () => import('@/views/otc_trade')
        }
      ]
    },
    {
      path: '/otc_trade',
      redirect: '/otc_trade/index',
      component: layout,
      name: 'otc_trade',
      children: [
        {
          path: '/otc_trade/index',
          component: () => import('@/views/otc_trade')
        }
      ]
    }

  ]
})
