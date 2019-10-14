// import { getFutureDictionaryList } from '@/api/contract'
export default {
  data() {
    return {
      websockets: [],
      // tickersData: null
      websocketArgs: ['1', 'BTCUSD']
    }
  },
  created() {
    // getFutureDictionaryList().then(res => {
    //   this.dataDictionary = res.data
    //   this.openWebSocket('market/tickers', this.handleTickers).then(() => this.$emit('baseDataLoaded'))
    // })
  },
  computed: {
    baseWSurl() {
      return process.env.VUE_APP_WS_API
    }
  },
  destroyed() {
    this.websockets.forEach(soket => soket.close())
  },
  methods: {
    openWebSocket(wsurl, callBack = () => {}) {
      return new Promise((resolve, reject) => {
        const websocket = new WebSocket(wsurl)
        websocket.onopen = () => {
          // websocket.send(`{"reqType":13,"param":{"assetCode":1,"time":1}}`)
          // websocket.send(`{"reqType":3,"param":{"assetCode":1,"period":1}}`)
          websocket.send(`{"reqType": 2, "args":["BTCUSD"]}`)
          websocket.send(`{"reqType": 1, "args":${JSON.stringify(this.websocketArgs)}}`)
          // websocket.send(`{"reqType":3,"param":{"assetCode":1,"period":1}}`)
          console.log(`${wsurl}连接成功`)
        }
        websocket.onerror = () => console.log(`${wsurl}连接发生错误`)
        websocket.onclose = () => console.log(`${wsurl}链接关闭`)
        this.websockets.push(websocket)
        websocket.onmessage = e => {
          let res = JSON.parse(e.data)
          res = res.code === 0 ? res.data : res
          resolve(websocket)
          callBack(res)
          // res.code === 0 && (resolve(websocket), callBack(res.data)) || reject(res)
        }
      })
    },
    closeWebSocket(wsurl) {
      const index = this.websockets.findIndex(item => item.url === `${this.baseWSurl}${wsurl}`)
      index !== -1 && this.websockets.splice(index, 1)[0].close()
    }
  }
}
