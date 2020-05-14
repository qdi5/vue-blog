module.exports = {
  lintOnSave: false,
  devServer: {
    port: 3008,
    host: '0.0.0.0',
    disableHostCheck: true,
    open: true,
    hotOnly: true,
    proxy: {
      '/api': {
        target: 'http://api.wuzhe.online',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
