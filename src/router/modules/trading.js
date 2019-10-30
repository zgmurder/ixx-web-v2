/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const tradingRouter = {
  path: '/trading',
  component: layout,
  name: 'trading',
  redirect: '/trading/index',
  children: [
    {
      path: '/trading/index',
      component: () => import('@/views/trading')
    }
  ]
}

export default tradingRouter
