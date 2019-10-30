<template>
  <div>
    aaa
  </div>
</template>
<script>
import { getProducts } from '@/api/share_option'
export default {
  name: 'ShareHistory',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created() {
    const obj = {
      'uid': 941484,
      'name': '张三',
      'region': 86,
      'email': '123@qq.com',
      'create_time': 1570861276000,
      'update_time': 1570861276000
    }
    getProducts(obj)
  },
  methods: {
    load() {
      console.log(1111)
    }
  }
}
</script>
