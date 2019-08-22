/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const otc_tradeRouter = {
  path: '/otc_trade',
  component: layout,
  name: 'otc_trade',
  redirect: '/otc_trade/index',
  children: [
    {
      path: '/otc_trade/index',
      component: () => import('@/views/otc_trade')
    }
  ]
}

export default otc_tradeRouter
