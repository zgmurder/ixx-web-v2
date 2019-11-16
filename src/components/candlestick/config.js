// import { getBars } from '@/api/contract'
import { getSymbolList, getKlineHistoryList } from '@/api/contract'

const udf_datafeed = {
  onReady: cb => {
    setTimeout(() => cb({
      supports_search: true,
      supports_group_request: false,
      supports_marks: false,
      // supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M']
      supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M']
    }))
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {},

  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    // getSymbolList().then(res => {
    //   console.log(res)
    // })
    console.log(symbolName)

    var split_data = symbolName.split(/[:/]/)
    var symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'America/New_York',
      ticker: symbolName,
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolution: ['1', '3', '5', '15', '30', '60', '120', '240', 'D'],
      volume_precision: 8,
      data_status: 'streaming'
    }

    if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
      symbol_stub.pricescale = 100
    }

    setTimeout(function() {
      onSymbolResolvedCallback(symbol_stub)
    }, 0)
  },

  getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    const [period, begin, end] = ['1m', from * 1000, to * 1000]
    // {
    //   period: period,
    //   pair: symbolInfo.ticker,
    //   begin: from * 1000,
    //   end: to * 1000
    // }
    // getKlineHistoryList()
    console.log(symbolInfo)
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {},

  unsubscribeBars: subscriberUID => {},

  /* 可选方法 */

  getServerTime: cb => {},

  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},

  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},

  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}
}
export const widgetOptions = {
  debug: false,
  symbol: 'Coinbase:BTC/USD',
  datafeed: udf_datafeed, // our datafeed object
  interval: '15',
  container_id: 'tv_chart_container',
  library_path: '/static/charting_library/',
  locale: 'zh',
  disabled_features: ['use_localstorage_for_settings'],
  enabled_features: [],
  client_id: 'test',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true,
  overrides: {
    'paneProperties.background': '#131722',
    'paneProperties.vertGridProperties.color': '#363c4e',
    'paneProperties.horzGridProperties.color': '#363c4e',
    'symbolWatermarkProperties.transparency': 90,
    'scalesProperties.textColor': '#AAA',
    'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
    'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f'
  }
}
