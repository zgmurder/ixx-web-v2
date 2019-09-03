<template>
  <div class="dynamic-update">
    <div id="container" />
    <ul class="time-tab" flex="main:justify cross:center box:mean">
      <li class="active">2m</li>
      <li>5m</li>
      <li>15m</li>
      <li>30m</li>
      <li>3h</li>
      <li>1d</li>
      <li>7d</li>
    </ul>
  </div>
</template>
<script>
import Highcharts from 'highcharts/highcharts'
import HighMap from 'highcharts/modules/map.js'
// console.log(HighMap)
HighMap(Highcharts)
export default {
  mounted() {
    this.initCharts()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    initCharts() {
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      })
      function activeLastPointToolip(chart) {
        var points = chart.series[0].points
        chart.tooltip.refresh(points[points.length - 1])
      }
      const that = this
      var chart = Highcharts.chart('container', {
        chart: {
          type: 'area',
          zoomType: 'x',
          // plotBackgroundImage: 'https://img.hcharts.cn/highcharts/graphics/skies.jpg',
          backgroundColor: 'rgba(0,0,0,0)',
          // marginRight: 10,
          events: {
            load: function() {
              var series = this.series[0]
              var chart = this
              activeLastPointToolip(chart)
              that.timer = setInterval(function() {
                var x = (new Date()).getTime() // 当前时间
                var y = Math.random() // 随机值
                series.addPoint([x, y], true, true)
                activeLastPointToolip(chart)
                // var obj = chart.xAxis[0].getExtremes()
                // chart.xAxis[0].setExtremes(obj.dataMin, new Date().getTime() + 36000)
              }, 1000)
            }
          }
        },
        mapNavigation: {
          enabled: true,
          enableButtons: false
        },
        plotOptions: {
          // 设置区域的透明度 fillOpacity: num 最大为1
          area: {
            color: '#fff'
          },
          series: {
            fillOpacity: 0.05,
            marker: {
              enabled: false
            },
            animation: {
              duration: 1000
            }
          },
          threshold: null
        },
        title: {
          text: '动态模拟实时数据'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 50,
          crosshair: {
            width: 1,
            color: 'rgba(167, 174, 196, 0.5)',
            snap: false
          },
          plotLines: [{
            color: 'red', // 线的颜色，定义为红色
            dashStyle: 'solid', // 标示线的样式，默认是solid（实线），这里定义为长虚线
            value: new Date().getTime(), // 定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
            width: 2 // 标示线的宽度，2px
          }],
          endOnTick: true,
          gridLineColor: 'rgba(167, 174, 196, 0.1)',
          gridLineWidth: 1 // 纵向网格线宽度
        },
        yAxis: {
          title: {
            text: null
          },
          crosshair: {
            width: 1,
            color: 'rgba(167, 174, 196, 0.5)',
            snap: false
          },
          gridLineColor: 'rgba(167, 174, 196, 0.1)'
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' +
				    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
				    Highcharts.numberFormat(this.y, 2)
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: '随机数据',
          data: (function() {
            // 生成随机值
            var data = []
            var time = (new Date()).getTime()
            var i
            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 3000,
                y: Math.random()
              })
            }
            return data
          }())
        }]
      })
    }
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
.dynamic-update{
  height: 100%;
  width: 100%;
  #container{
    width: 100%;
    height: calc(100% - 34px);
  }
  .time-tab{
    height: 34px;
    text-align: center;
    background: #363E4F;
    line-height: 34px;
    color: #999;
    &>li{
      &.active,&:hover{
        box-shadow: 0 2px 0 0 #fff inset;
        background: #4F596D;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
