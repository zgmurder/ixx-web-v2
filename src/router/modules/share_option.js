/** When your routing table is too long, you can split it into small modules**/

import layout from '@/layout'

const share_optionRouter = {
  path: '/share_option',
  component: layout,
  name: 'share_option',
  redirect: '/share_option/index',
  children: [
    {
      path: '/share_option/index',
      component: () => import('@/views/share_option')
    }
  ]
}

export default share_optionRouter
