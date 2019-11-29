import ReconnectingWebSocket from 'reconnecting-websocket'
import { WSURL } from '@/const'
export default {
  data() {
    return {
      websocket: null
    }
  },
  destroyed: function() {
    this.websocket.close()
  },
  methods: {
    openWebSocket(callBack = () => {}, onopen = () => {}) {
      return new Promise((resolve, reject) => {
        const websocket = new ReconnectingWebSocket(WSURL)
        websocket.onopen = onopen
        websocket.onclose = () => console.log(`${WSURL}链接关闭`)
        this.websocket = websocket
        websocket.onmessage = e => {
          const res = JSON.parse(e.data)
          if (!res.code || res.code === 200) {
            typeof callBack === 'function' && callBack(res)
            resolve(this.websocket)
          } else reject(res)
        }
      })
    },
    closeWebSocket() {
      this.websocket.close()
    }
  }
}
