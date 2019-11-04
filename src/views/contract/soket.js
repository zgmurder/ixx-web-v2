// import { getFutureDictionaryList } from '@/api/contract'
export default {
  data() {
    return {
      websockets: []
      // tickersData: null
    }
  },
  created() {
    // getFutureDictionaryList().then(res => {
    //   this.dataDictionary = res.data
    //   this.openWebSocket('/market/tickers', this.handleTickers).then(() => this.$emit('baseDataLoaded'))
    // })
  },
  computed: {
    baseWSurl() {
      return process.env.VUE_APP_WS_API
    }
  },
  destroyed: function() {
    this.websockets.forEach(soket => soket.close())
  },
  methods: {
    openWebSocket(wsurl, callBack = () => {}) {
      return new Promise((resolve, reject) => {
        const websocket = new WebSocket(`${this.baseWSurl}${wsurl}`)
        websocket.onopen = () => console.log(`${wsurl}连接成功`)
        websocket.onerror = () => console.log(`${wsurl}连接发生错误`)
        websocket.onclose = () => console.log(`${wsurl}链接关闭`)
        this.websockets.push(websocket)
        websocket.onmessage = e => {
          const res = JSON.parse(e.data)
          res.code === 0 && (resolve(res.data), callBack(res.data)) || reject(res)
        }
      })
    },
    closeWebSocket(wsurl) {
      const index = this.websockets.findIndex(item => item.url === `${this.baseWSurl}${wsurl}`)
      index !== -1 && this.websockets.splice(index, 1)[0].close()
    }
  }
}
