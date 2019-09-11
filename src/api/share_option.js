import request from '@/utils/request'

export const getuid = query => request({
  url: 'https://fota.com/option/index.html',
  method: 'get',
  params: query,
  headers: {
    aaa: 111
  }
})
