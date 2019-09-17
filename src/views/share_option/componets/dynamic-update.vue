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
HighMap(Highcharts)
export default {
  // props: {
  //   'isReflow': Boolean
  // },
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
        // console.log(this.$el, lineBox, this)

        this.countUp = new CountUp(this.chart.yAxis[0].plotLinesAndBands[0].label.element.children[0], data[data.length - 1].y, data[data.length - 1].y, 4, 1, {
          formattingFn(res) {
            if (!res) return res
            const arr = String(res).split('.')
            return `<span>${arr[0]}.<span style="font-size:16px;position:absolute;margin-left:-5px">${arr[1]}</span></span>`
          }
        })
        // const xPixels = this.chart.xAxis[0].toPixels(data[data.length - 1].x)
        // const yPixels = this.chart.yAxis[0].toPixels(data[data.length - 1].y)
        // const orderTime = new Date(res.timeStamp).setSeconds(40)
        // const finishTime = orderTime + 20000
        // const orderPixels = this.chart.xAxis[0].toPixels(orderTime)
        // const finishPixels = this.chart.xAxis[0].toPixels(finishTime)

        const { orderPixels, finishPixels } = this.handleLinePixelsByTime(res.timeStamp)
        this.chart.renderer.label(`<div id="orderTime" class="time-line white  opacity" style="transform: translate(${orderPixels}px, 0px);">
          <div class="time-line-main">
            <div class="box"></div>
            <div class="time-lineL" />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-flag" />
            </svg>
            <div class="mask" style="width:0" />
          </div>
        </div>`, 0, 0, 'rect', 0, 0, true).add()
        // this.chart.renderer.label(`<div id="ripple" class="ripple"></div>`, 0, 0, 'rect', 0, 0, true).add()

        this.chart.renderer.label(`<div id="finishTime" class="time-line  opacity" style="transform: translate(${finishPixels}px, 0px);">
          <div class="time-line-main">
            <div class="box" style="background:none;color:red">00 : 19</div>
            <div class="time-lineL yellow" />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-time" />
            </svg></div>
        </div>`, 0, 0, 'rect', 0, 0, true).add()

        this.orderTimeElement = document.querySelector('#orderTime')
        this.finishTimeElement = document.querySelector('#finishTime')
        this.rippleElement = document.querySelector('#ripple')
        const orderBoxElement = this.orderTimeElement.querySelector('.box')

        const yetTime = (new Date(res.timeStamp).setSeconds(40) - res.timeStamp) / 1000 - 1
        this.orderBoxCountUp = new CountUp(orderBoxElement, yetTime, 0, 0, yetTime, {
          useEasing: false,
          prefix: '00 ：'
        })
        this.orderBoxCountUp.start()
        // const finishBoxElement = this.finishTimeElement.querySelector('.box')

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
        const resTime = res.lineBinaryOptionPriceIndex.time
        const { orderPixels, finishPixels } = this.handleLinePixelsByTime(resTime)
        // console.log(orderPixels, finishPixels)
        this.orderTimeElement.style.transform = `translate(${orderPixels}px, 0px)`
        this.finishTimeElement.style.transform = `translate(${finishPixels}px, 0px)`
        this.rippleElement.style.right = this.chart.containerWidth - this.chart.xAxis[0].toPixels(resTime, true) - 19 + 'px'
        // this.rippleElement.style.top = this.chart.yAxis[0].toPixels(price, true) + 'px'

        const markElement = this.orderTimeElement.querySelector('.mask')
        const orderBoxElement = this.orderTimeElement.querySelector('.box')
        const finishBoxElement = this.finishTimeElement.querySelector('.box')
        if (resTime >= new Date(resTime).setSeconds(40)) {
          if (orderBoxElement.innerText !== '下一轮') {
            const finishCountUp = new CountUp(finishBoxElement, 20, 0, 0, 20, { useEasing: false, prefix: '00 ：' })
            finishCountUp.start()
          }
          orderBoxElement.innerText = '下一轮'
        } else {
          finishBoxElement.innerText = ''
          if (orderBoxElement.innerText === '下一轮') {
            // this.orderBoxCountUp.reset()
            this.orderBoxCountUp = new CountUp(orderBoxElement, 40, 0, 0, 40, { useEasing: false, prefix: '00 ：' })
            this.orderBoxCountUp.start()
          }
        }
        markElement.style.width = resTime >= new Date(resTime).setSeconds(40) ? '50vw' : 0
        // this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d = price
        // const linePath = this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d.split(' ')
        // linePath.splice(4, 1, xPixels)
        // this.chart.yAxis[0].plotLinesAndBands[0].svgElem.d = linePath.join(' ')

        this.chart.series[0].addPoint([resTime, price])

        const dataCout = this.chart.series[0].data.filter(item => item.x > min).length

        if (dataCout > 400 && this.isNoScroll) this.initxAxis()
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
    handleLinePixelsByTime(time) {
      const orderTime = new Date(time).setSeconds(40)
      const finishTime = orderTime + 20000
      const orderPixels = this.chart.xAxis[0].toPixels(orderTime, true)
      const finishPixels = this.chart.xAxis[0].toPixels(finishTime, true)
      return { orderPixels, finishPixels }
    },
    initxAxis() {
      const dataArr = this.chart.series[0].data
      this.chart.xAxis[0].update({ min: dataArr[dataArr.length - 200].x })
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
        animation: {
          duration: 1000
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
          formatter: function(a, b) {
            return `<div>
              <p style="color:#fff; margin-bottom:5px;"><span style="color:#A8ACBB; margin-right:5px;">：${this.x}</span></p>
              <p style="color:#fff; margin-bottom:0px;"><span style="color:#A8ACBB;margin-right:5px;">${this.y}</p>
              </div>`
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
          tickPixelInterval: 200,
          // tickInterval: 60 * 1000,
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
          tickPixelInterval: 200,
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
                  <div class="line down"></div> 
                  <div id="ripple" class="ripple"></div>`
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
    display: none;
    &.up{
      top: 50%;
      background: linear-gradient(to bottom, rgba(202,38,38,0.3), transparent);
    }
    &.down{
      bottom: 50%;
      background: linear-gradient(to top, rgba(30,139,33,0.3), transparent);
    }
  }

  .time-line {
    position: absolute;
    top: 20px;
    // bottom: 78px;
    // left: 65px;
    z-index: 9;
    height: calc(100vh - 150px);
    // height: 500;
    transition: transform .5s linear;
    will-change: transform, opacity;
    pointer-events: none;
    &.yellow{
      left: 20px;
    }
    .time-line-main {
      position: relative;
      z-index: 11;
      height: 100%;
      &>.txt {
        font-size: 14px;
        transform: translateX(-50%);
        will-change: contents;
      };
      &>.box {
        position: relative;
        z-index: 12;
        min-width: 60px;
        line-height: 2;
        border-radius: 4px;
        background: #fff;
        opacity: .8;
        font-size: 12px;
        color: #000;
        text-align: center;
        transform: translateX(-50%);
      }
      .icon {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 11;
        width: 20px;
        height: 20px;
        font-size: 30px;
        transform: translateX(-50%);
        border:2px solid #fff;
        border-radius: 50%;
        padding: 5px;
        background: #000;
      }
    };
    .time-lineL {
      position: absolute;
      top: 0;
      bottom: 0;
      // left: -1px;
      width: 2px;
      background: linear-gradient(to top, rgba(30,139,33,1), transparent);
    }
    .time-lineL.yellow {
      position: absolute;
      top: 0;
      bottom: 0;
      // left: -1px;
      width: 2px;
      background: linear-gradient(to top, red, transparent);
    }
    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50vw;
      z-index: -1;
      opacity: .3;
      transition: width .4s, opacity .5s;
      background-image: linear-gradient(to right, #28677A, transparent);
      // animation: maskIn .25s linear;
      animation-fill-mode: forwards;
    }
  }
  .ripple{
    display: block;
    width: 4px;
    height: 4px;
    // margin: 160px auto;
    animation: ripple 0.6s linear infinite;
    border-radius: 50px;
    background-color: red;
    position: absolute;
    top: 13px;
    // transform: translateY(-50%);
    right: 500px;
  }
}
@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 128, 0, 0.1), 0 0 0 20px rgba(0, 128, 0, 0.1), 0 0 0 40px rgba(0, 128, 0, 0.1), 0 0 0 60px rgba(0, 128, 0, 0.1);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 128, 0, 0.1), 0 0 0 40px rgba(0, 128, 0, 0.1), 0 0 0 60px rgba(0, 128, 0, 0.1), 0 0 0 80px rgba(0, 128, 0, 0);
  }
}
</style>
