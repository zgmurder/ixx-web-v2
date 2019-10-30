/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const contractRouter = {
  path: '/contract',
  component: layout,
  name: 'contract',
  redirect: '/contract/index',
  meta: {
    title: '合约交易'
  },
  children: [
    {
      path: '/contract/index',
      component: () => import('@/views/contract')
    }
  ]
}

export default contractRouter
