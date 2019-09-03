import { getFUTUREList } from '@/api/contract'
import { bigRound } from '@/utils/handleNum'
export default {
  data() {
    return {
      websockets: [],
      tickersData: null,
      dataDictionary: [],

      delegateData: null
    }
  },
  created() {
    getFUTUREList().then(res => {
      this.dataDictionary = res.data
      this.startWebSokets()
    })
  },
  destroyed: function() {
    this.websockets.forEach(soket => soket.close())
  },
  methods: {
    startWebSokets() {
      this.initSoketConfigs()
      this.initWebSocket()
    },
    initSoketConfigs() {
      const baseUrl = process.env.VUE_APP_WS_API
      this._soketConfigs = [
        { url: baseUrl + 'market/tickers', onmessage: this.handleTickers },
        { url: baseUrl + 'orderbook/FUTURE_BTCUSD/0/1/20', onmessage: this.handleBTCUSD }
      ]
    },
    initWebSocket() {
      if (!this._soketConfigs.length) return this.$emit('dataLoaded')
      const soketConfig = this._soketConfigs.splice(0, 1)[0]
      const soket = new WebSocket(soketConfig.url)
      this.websockets.push(soket)
      soket.onopen = () => console.log(`${soketConfig.url}连接成功`)
      soket.onerror = () => console.log(`${soketConfig.url}连接发生错误`)
      soket.onclose = () => console.log(`${soketConfig.url}链接关闭`)
      soket.onmessage = e => {
        const res = JSON.parse(e.data)
        if (res.code !== 0) return console.log(`服务器异常`)
        new Promise(resolve => {
          soketConfig.onmessage(res.data)
          resolve()
        }).then(this.initWebSocket)
      }
    },
    handleTickers(data) {
      const matchArr = ['FUTURE', 'INDEX', 'MARKET']
      const dictionary = [...this.dataDictionary]
      const dataArr = data.filter(item => matchArr.includes(item.pair.split('_')[0]))
      const objArr = dataArr.reduce((curr, prev) => {
        const key = prev.pair.split('_')[0]
        const index = dictionary.findIndex(item => item.name === prev.pair)
        index !== -1 && (prev.dictionary = dictionary.splice(index, 1)[0])
        curr[key] = [...(curr[key] || []), prev]
        return curr
      }, {})
      this.tickersData = objArr
      // console.log(this.socketData)
    },
    handleBTCUSD(data) {
      this.delegateData = data
    }
  }
}
