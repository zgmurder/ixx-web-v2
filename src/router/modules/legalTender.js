/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const otc_tradeRouter = {
  path: '/legalTender',
  component: layout,
  name: 'legalTender',
  redirect: '/legalTender/index',
  children: [
    {
      path: '/legalTender/index',
      component: () => import('@/views/legalTender')
    }
  ]
}

export default otc_tradeRouter
