/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const userRouter = {
  path: '/user',
  component: layout,
  name: 'user',
  redirect: '/user/index',
  meta: {
    needSign: true,
    title: '用户中心'
  },
  children: [
    {
      path: '/user/login',
      component: () => import('@/views/user/login')
    },
    {
      path: '/user/register',
      component: () => import('@/views/user/register')
    },
    {
      path: '/user/forget',
      component: () => import('@/views/user/forget')
    },
    {
      path: '/user/index',
      component: () => import('@/views/user/index')
    },
    {
      path: '/user/property',
      component: () => import('@/views/user/property')
    }
  ]
}

export default userRouter
