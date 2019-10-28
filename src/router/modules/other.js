/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const otherRouter = {
  path: '/other',
  component: layout,
  name: 'other',
  // redirect: '/other/index',
  children: [
    {
      path: '/other/proposer',
      component: () => import('@/views/other/proposer')
    }
  ]
}

export default otherRouter
