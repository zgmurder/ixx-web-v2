/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const userRouter = {
  path: '/user',
  component: layout,
  name: 'user',
  redirect: '/user/login',
  children: [
    {
      path: '/user/login',
      component: () => import('@/views/user/login')
    },
    {
      path: '/user/register',
      component: () => import('@/views/user/register')
    }
  ]
}

export default userRouter
