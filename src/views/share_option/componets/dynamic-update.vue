<template>
  <div
    id="container"
    v-loading="isLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  />
</template>
<script>
import Highcharts from 'highcharts/highcharts'
import HighMap from 'highcharts/modules/map.js'
import websoketMixin from '@/mixins/soket'
import CountUp from 'countup/dist/countUp.min'
import lineBox from './line'
HighMap(Highcharts)
export default {
  // props: {
  //   'isReflow': Boolean
  // },
  components: {
    lineBox
  },
  mixins: [websoketMixin],
  data() {
    return {
      isLoading: false,
      isNoScroll: true
    }
  },
  mounted() {
    this.isLoading = true
    this.openWebSocket('wss://fota.com/apioption/wsoption?brokerId=1', res => {
      if (res.spotIndexDTOList) {
        const data = res.spotIndexDTOList.map(item => {
          const numPrice = Number(item.price)
          return { x: item.time, y: numPrice }
        })
        this.chart = this.initCharts(data)
        console.log(this.chart)
        console.log(this.$el, lineBox, this)

        this.countUp = new CountUp(this.chart.yAxis[0].plotLinesAndBands[0].label.element.children[0], data[data.length - 1].y, data[data.length - 1].y, 4, 1, {
          formattingFn(res) {
            if (!res) return res
            const arr = String(res).split('.')
            return `<span>${arr[0]}.<span style="font-size:16px;position:absolute;margin-left:-5px">${arr[1]}</span></span>`
          }
        })
        // const xPixels = this.chart.xAxis[0].toPixels(data[data.length - 1].x)
        // const yPixels = this.chart.yAxis[0].toPixels(data[data.length - 1].y)
        this.chart.renderer.label(`<div class="time-line white  opacity" style="transform: translate(1113.44px, 0px);">
      <div class="time-line-main">
        <div class="box">下一轮</div>
        <div class="time-lineL" />
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-flag" />
        </svg></div>
      <div class="mask" />
    </div>`).add()
        // this.chart.xAxis[0].update({ min: data })
        // this.chart.mapZoom(1, 1, 1, 1, 1)
        this.chart.pointer.onContainerMouseWheel = (e) => {
          // this.chart.xAxis[0].setExtremes(dataMin, res.lineBinaryOptionPriceIndex.time + 120000)
          // console.log(this.chart)
          // console.log(e)

          const { min, max } = this.chart.xAxis[0].getExtremes()
          // const calcMin = min - 60 * e.deltaY
          this.chart.xAxis[0].update({ min: Math.min(min - 60 * e.deltaY, max) })
          this.isNoScroll && this.chart.showResetZoom()
          this.isNoScroll = false
          // console.log(Highcharts.map)
          // const element = this.chart.renderer.button('重置', 10, 10).attr({
          //   fill: '#FFFFEF',
          //   stroke: 'gray',
          //   'stroke-width': 1,
          //   zIndex: 4
          // }).add()
          // element.on('click', function(a) {
          //   console.dir(this)
          //   console.log(element)
          //   element.fadeOut()
          //   // this.destroy()
          // })
          // this.chart.showResetZoom()
        }
        // this.chart.series[0].setData(data)
        // this.chart.xAxis[0].setExtremes(data[0].x, Number(data[data.length - 1].x) + 120000)
        // [Number howMuch], [Number centerX], [Number centerY], [Number mouseX], [Number mouseY]
        // this.chart.mapZoom(4)
        // console.log(this.chart)

        // this.chart.yAxis[0].setExtremes(yMin - 20, yMax + 20)
        this.isLoading = false
      } else if (res.lineBinaryOptionPriceIndex) {
        // const yAxis = this.chart.yAxis[0]
        const { min } = this.chart.xAxis[0].getExtremes()
        // xAxis.update({ max: dataMax + 120000 })
        // yAxis.update({ max: yAxis.getExtremes().dataMax, min: yAxis.getExtremes().dataMin })
        // this.chart.xAxis[0].setExtremes(dataMin, res.lineBinaryOptionPriceIndex.time + 120000)
        const price = Number(res.lineBinaryOptionPriceIndex.price)
        // const xPixels = this.chart.xAxis[0].toPixels(res.lineBinaryOptionPriceIndex.time)
        const plotLinesAndBand = this.chart.yAxis[0].plotLinesAndBands[0]
        plotLinesAndBand.options.value = price
        // plotLinesAndBand.label.element.children[0].innerText = price

        this.countUp.update(price)
        // console.log(this.chart.yAxis[0].plotLinesAndBands[0].renderLabel())
        // this.chart.yAxis[0].plotLinesAndBands[0].label.alignOptions.formatter.call()
        // this.chart.yAxis[0].plotLinesAndBands[0].label.alignOptions.formatter()
        // this.chart.yAxis[0].plotLinesAndBands[1].options.value = price

        // this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d = price
        // const linePath = this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d.split(' ')
        // linePath.splice(4, 1, xPixels)
        // this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d = linePath.join(' ')

        this.chart.series[0].addPoint([res.lineBinaryOptionPriceIndex.time, price])

        const dataCout = this.chart.series[0].data.filter(item => item.x > min).length
        if (dataCout > 100 && this.isNoScroll) this.initxAxis()
      } else {
        // console.log(res)
      }
    }).then(websocket => {
      websocket.send(`{"reqType":9,"param":{"id":1,"period":1,"optionType":1}}`)
      websocket.send(`{"reqType":1,"param":{"assetCode":1,"optionType":1}}`)
    })
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    initxAxis() {
      const dataArr = this.chart.series[0].data
      this.chart.xAxis[0].update({ min: dataArr[dataArr.length - 43].x })
    },
    initCharts(dataArr) {
      Highcharts.setOptions({
        global: { useUTC: false }
      })
      // function activeLastPointToolip(chart) {
      //   var points = chart.series[0].points
      //   chart.tooltip.refresh(points[points.length - 1])
      // }
      const that = this
      return Highcharts.chart('container', {
        rangeSelector: { selected: 1
        },
        title: {
          text: ''
        },
        chart: {
          className: 'myChart',
          marginRight: 10,
          // marginBottom: 20,
          spacingRight: 100,
          // spacing: 60,
          // panning: !1,
          // panning: true,
          // panKey: 'shift',
          backgroundColor: 'transparent',
          // animation: Fl.animation,
          resetZoomButton: {
            position: {
              align: 'left', // by default
              x: 10
            }
          },
          events: {
            load: function() {
              // var n = C()(this.series, 1)
              // jl = n[0]
            },
            redraw: function() {
              // fs(Fl.ws1time)
            },
            selection: function() {
              that.initxAxis()
              that.isNoScroll = true
              // this.resetZoomButton
              // console.dir(this.resetZoomButton.element)
              // this.resetZoomButton.element.style.display = 'none'
              // this.resetZoomButton.element.innerHTML = ''
              this.resetZoomButton.fadeOut()

              // this.resetZoomButton.opacity = 0
              // this.resetZoomButton.destroy()
            }
          }
        },
        credits: {
          enabled: !1
        },
        navigation: {
          menuStyle: {
            display: 'none'
          }
        },
        plotOptions: {
          series: {
            lineColor: '#fff',
            lineWidth: 2,
            fillOpacity: 0.05,
            stickyTracking: !1,
            dataLabels: {
              enabled: !1
            },
            marker: {
              enabled: !1
            }
            // pointInterval: 1000
          },
          cursor: 'pointer'
        },
        scrollbar: {
          enabled: !1
        },
        tooltip: {
          useHTML: !0,
          xDateFormat: '%H:%M:%S',
          backgroundColor: 'rgba(79,89,109,0.8)',
          formatter: function() {
            return ''
          },
          borderColor: 'transparent',
          borderRadius: 8
        },
        mapNavigation: {
          enabled: true,
          enableButtons: false,
          enableMouseWheelZoom: true,
          enableDoubleClickZoomTo: false
        },
        xAxis: {
          type: 'datetime',
          lineWidth: 0,
          tickColor: 'transparent',
          // tickInterval: 10,
          // tickPixelInterval: 60 * 1000,
          title: null,
          // min: dataArr[dataArr.length - 43].x,
          dateTimeLabelFormats: {
            second: '%H:%M:%S'
          },
          maxPadding: 0.55,
          crosshair: {
            snap: !1,
            color: 'rgba(167, 174, 196, 0.3)',
            dashStyle: 'Solid'
          },
          labels: {
            style: {
              color: 'rgba(167, 174, 196, 0.5)'
            }
          },
          gridLineColor: 'rgba(167, 174, 196, 0.1)',
          gridLineWidth: 2
        },
        legend: {
          enabled: !1
        },
        showCheckBox: !0,
        yAxis: {
          offset: -60,
          opposite: !0,
          // tickPixelInterval: 500,
          tickPositioner: function() {
            // console.log(this.max, this.min)

            // return []
          },
          labels: {
            useHTML: true,
            formatter: function() {
              return `
                  <div class="priceTag">${this.value}</div>
                  <div class="line up"></div>
                  <div class="line down"></div> `
            },
            x: -20
            // step: 2
            // reserveSpace: false
          },
          allowDecimals: !0,
          title: null,
          snap: !1,
          crosshair: {
            snap: !1,
            color: 'rgba(167, 174, 196, 0.3)',
            dashStyle: 'Solid'
          },
          // labels: {
          //   style: {
          //     color: 'rgba(167, 174, 196, 0.5)'
          //   }
          // },
          gridLineColor: 'rgba(167, 174, 196, 0.1)',
          gridLineWidth: 2,
          plotLines: [{
            color: '#cccccc',
            width: 1,
            dashStyle: 'Dash',
            value: dataArr[dataArr.length - 1].y,
            label: {
              align: 'right',
              x: -0,
              useHTML: true,
              formatter: function() {
                return `
                  <div class="priceTag plotline">${this.options.value}</div>
                  <div class="line up"></div>
                  <div class="line down"></div> `
              }
            }
          }]
        },
        series: [{
          type: 'area',
          data: dataArr,
          animation: !0,
          threshold: null,
          turboThreshold: 0,
          allowPointSelect: !0,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [[0, 'rgba(117,122,136,0.5)'], [1, 'rgba(88,91,114,0)']]
          }
        }]
      })
    }
  }
  //   initCharts(dataArr) {
  //     Highcharts.setOptions({
  //       global: {
  //         useUTC: false
  //       }
  //     })
  //     // function activeLastPointToolip(chart) {
  //     //   var points = chart.series[0].points
  //     //   chart.tooltip.refresh(points[points.length - 1])
  //     // }
  //     return Highcharts.chart('container', {
  //       credits: { enabled: false },
  //       navigation: {
  //         menuStyle: {
  //           display: 'none'
  //         }
  //       },
  //       chart: {
  //         type: 'area',
  //         // zoomType: 'x',
  //         // panning: true,
  //         // panKey: 'shift',
  //         backgroundColor: 'rgba(0,0,0,0)'
  //       },
  //       rangeSelector: {
  //         buttons: [{
  //           count: 1,
  //           type: 'minute',
  //           text: '1M'
  //         }, {
  //           count: 5,
  //           type: 'minute',
  //           text: '5M'
  //         }, {
  //           type: 'all',
  //           text: 'All'
  //         }],
  //         inputEnabled: false,
  //         selected: 0
  //       },
  //       mapNavigation: {
  //         enabled: true,
  //         enableButtons: false
  //       },
  //       plotOptions: {
  //         // 设置区域的透明度 fillOpacity: num 最大为1
  //         area: { color: '#fff' },
  //         series: {
  //           fillOpacity: 0.05,
  //           marker: { enabled: false },
  //           animation: { duration: 1000 }
  //           // pointInterval: 1000
  //         },
  //         threshold: null
  //       },
  //       title: {
  //         text: '动态模拟实时数据'
  //       },
  //       xAxis: {
  //         type: 'datetime',
  //         // tickPixelInterval: 3000,
  //         tickInterval: 1000 * 15,
  //         // minRange: 20000,
  //         crosshair: { width: 1, color: 'rgba(167, 174, 196, 0.5)', snap: false }
  //         // endOnTick: true,
  //         // gridLineColor: 'rgba(167, 174, 196, 0.1)',
  //         // gridLineWidth: 1,
  //         // tickAmount: 6
  //       },
  //       yAxis: {
  //         title: { text: null },
  //         crosshair: {
  //           width: 1,
  //           color: 'rgba(167, 174, 196, 0.5)',
  //           snap: false
  //         },
  //         gridLineColor: 'rgba(167, 174, 196, 0.1)',
  //         tickPixelInterval: 1000,
  //         tickInterval: 1,
  //         tickAmount: 12,
  //         min: 10230,
  //         opposite: true,
  //         labels: {
  //           useHTML: true,
  //           formatter: function() {
  //             return `
  //               <div class="priceTag">${this.value}</div>
  //               <div class="line up"></div>
  //               <div class="line down"></div>
  //             `
  //           },
  //           x: -80
  //           // step: 2
  //           // reserveSpace: false
  //         }
  //       },
  //       // tooltip: {
  //       //   formatter: function() {
  //       //     return `<b>${this.series.name}</b><br/>${Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)}<br/>${Highcharts.numberFormat(this.y, 2)}`
  //       //   }
  //       // },
  //       legend: {
  //         enabled: false
  //       },
  //       series: [{
  //         type: 'area',
  //         data: dataArr
  //       }]
  //     })
  //   }
  // }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
#container{
  .myChart .highcharts-range-selector-group {
  display: none; }

  .myChart .highcharts-exporting-group {
    display: none; }
  .priceTag{
    position: relative;
    z-index: 3;
    width: 78px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #4F596D;
    border-radius: 13px;
    background-color: #171C29;
    text-align: center;
    font-size: 12px;
    color: #8F97AE;
    cursor: pointer;
    opacity: 0.6;
    &:hover{
      // color: #fff;
      opacity: 1;
      & ~ div{
        display: block
      }
    }
    &.plotline{
      background: #ccc;
      border-radius: 2px 0 0 2px;
      color: #171C29;
      opacity: 1;
      line-height: 30px;
      height: 30px;
      width: 100px;
      text-align: left;
      text-indent: 5px;
      &:before {
          content: '';
          width: 0;
          height: 0;
          border-width: 15px;
          border-style: solid;
          border-color:transparent #ccc transparent transparent;
          position: absolute;
          left: -30px;
          top: 0px;
          z-index: -1;
      }
    }
  }
  .line{
    width: 100vw;
    z-index: 1;
    height: 100px;
    right: 0;
    // background: #000;
    position: absolute;
    display: none
  }
  .up{
    top: 50%;
    background: linear-gradient(to bottom, rgba(202,38,38,0.3), transparent);
  }
  .down{
    bottom: 50%;
    background: linear-gradient(to top, rgba(30,139,33,0.3), transparent);
  }
}

</style>
