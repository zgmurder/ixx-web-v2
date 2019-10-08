'use strict'
const path = require('path')
// const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  css: {
    loaderOptions: { sass: { data: `@import "@/styles/variables.scss";` }}
  },
  devServer: {
    port: 8081,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      'https://q.ixex.io/': {
        target: `https://q.ixex.io/`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + 'https://q.ixex.io/']: ''
        }
      }
    }
    // proxy: {
    //   'wss://fota.com/apioption/wsoption': { // 这里最好有一个 /
    //     target: 'wss://ws.ixex.io/v1/market/tickers', // 后台接口域名
    //     ws: true, // 如果要代理 websockets，配置这个参数
    //     changeOrigin: true // 是否跨域
    //     // pathRewrite: {
    //     //   ['^' + 'wss://fota.com/']: ''
    //     // }
    //     // headers: {
    //     //   'Accept-Encoding': 'gzip, deflate, br',
    //     //   'Accept-Language': 'zh-CN,zh;q=0.9',
    //     //   'Cache-Control': 'no-cache',
    //     //   'Connection': 'Upgrade',
    //     //   'Cookie': '__cfduid=dce877908d48e3b6d97831b6e2bf6635c1566884923; _ga=GA1.2.2012425230.1566885574; Hm_lvt_fca65bea641967eba58b189428d9fa15=1566884926,1566955312,1567042203,1567674273; SESSION=ZjYyNDlkZWItYWM3ZC00MzM5LTk4MDItMWRkNTAyMTk4YzNl; Hm_lpvt_fca65bea641967eba58b189428d9fa15=1567738820',
    //     //   'Host': 'fota.com',
    //     //   'Origin': 'https://fota.com',
    //     //   'Pragma': 'no-cache',
    //     //   'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    //     //   'Sec-WebSocket-Key': 'Ju2O8xYprshHLUN4iU5uwQ==',
    //     //   'Sec-WebSocket-Version': '13',
    //     //   'Upgrade': 'websocket',
    //     //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
    //     // }
    //   }
    // }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
