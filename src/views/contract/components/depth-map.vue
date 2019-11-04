<template>
  <div id="depth-map" style="height:100%" />
</template>
<script>
import Highcharts from 'highcharts/highcharts'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    data: {
      handler(newValue) {
        if (!this.chart) return
        Object.keys(newValue).map((key, index) => {
          const arrData = newValue[key].map(item => [+item.values[0], +item.values[2]]).sort((a, b) => a[0] - b[0])
          this.chart.series[index].setData(arrData, false, false, true)
        })
        this.chart.redraw()
      }
    }
  },
  mounted() {
    this.chart = Highcharts.chart('depth-map', {
      chart: {
        type: 'area',
        zoomType: 'xy',
        backgroundColor: 'transparent'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },

      xAxis: {
        minPadding: 0,
        maxPadding: 0,
        gridLineColor: 'rgba(167, 174, 196, 0.1)',
        gridLineWidth: 1
      },
      yAxis: [{
        lineWidth: 1,
        gridLineColor: 'rgba(167, 174, 196, 0.1)',
        gridLineWidth: 1,
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          align: 'left',
          x: 8
        }
      }, {
        opposite: true,
        linkedTo: 0,
        gridLineColor: 'rgba(167, 174, 196, 0.1)',
        gridLineWidth: 1,
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          align: 'right',
          x: -8
        }
      }],
      plotOptions: {
        area: {
          fillOpacity: 0.2,
          lineWidth: 1,
          step: 'center',
          enabled: false
        },
        series: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
        valueDecimals: 2
      },
      series: [
        {
          name: 'Asks',
          data: [],
          color: '#fc5857'
        },
        {
          name: 'Bids',
          data: [],
          color: '#03a7a8'
        }
      ]
    })
  }
}
</script>
