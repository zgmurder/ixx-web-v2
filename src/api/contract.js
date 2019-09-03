
import request from '@/utils/request'

export const getFUTUREList = query => request({
  url: 'contract/symbol/list',
  method: 'post',
  params: query
})
