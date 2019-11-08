// import { getFutureDictionaryList } from '@/api/contract'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  data() {
    return {
      websockets: []
    }
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
    openWebSocket(wsurl, callBack = () => {}, onopen) {
      return new Promise((resolve, reject) => {
        wsurl = wsurl.startsWith('wss:') ? wsurl : `${this.baseWSurl}${wsurl}`
        const websocket = new ReconnectingWebSocket(wsurl)
        websocket.onopen = () => {
          console.log(`${wsurl}连接成功`)
          onopen && onopen(websocket)
        }
        websocket.onerror = () => console.log(`${wsurl}连接发生错误`)
        websocket.onclose = () => console.log(`${wsurl}链接关闭`)
        this.websockets.push(websocket)
        websocket.onmessage = e => {
          const res = JSON.parse(e.data);
          (res.code === 0 || res.code === 200) && (resolve(websocket), callBack(res.data)) || reject(res)
        }
      })
    },
    closeWebSocket(wsurl) {
      const index = this.websockets.findIndex(item => item.url === `${this.baseWSurl}${wsurl}`)
      index !== -1 && this.websockets.splice(index, 1)[0].close()
    }
  }
}
