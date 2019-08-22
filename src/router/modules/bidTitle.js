/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const bidTitleRouter = {
  path: '/bidTitle',
  component: layout,
  name: 'bidTitle',
  redirect: '/bidTitle/index',
  children: [
    {
      path: '/bidTitle/index',
      component: () => import('@/views/bidTitle')
    }
  ]
}

export default bidTitleRouter
