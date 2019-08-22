/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const fund_assets_node_buyRouter = {
  path: '/fund_assets_node_buy',
  component: layout,
  name: 'fund_assets_node_buy',
  redirect: '/fund_assets_node_buy/index',
  children: [
    {
      path: '/fund_assets_node_buy/index',
      component: () => import('@/views/fund_assets_node_buy')
    }
  ]
}

export default fund_assets_node_buyRouter
