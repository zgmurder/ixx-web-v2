<template>
  <div id="container" style="height:100%" />
</template>
<script>
// import TradingView from '@/assets/charting_library/charting_library.min.js'
// console.log(process.env.BASE_URL)

// const TradingView = require(`${process.env.BASE_URL}static/charting_library/charting_library.min.js`)
// const datafeeds = require('/static/datafeeds/udf/dist/bundle.js')
// console.log(TradingView, datafeeds)

import { widgetOptions } from './config'
export default {
  mounted() {
    window.tvWidget = new TradingView.widget(Object.assign(widgetOptions, { container_id: 'container' }))
  }
}
</script>
