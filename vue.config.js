module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,


    devServer: {
        open: process.platform === "darwin",
        disableHostCheck: false,
        host: "0.0.0.0",
        port: 8888,
        https: false,
        hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: "http://localhost:8000" // string | Object
        // before: app => {}
      },
      pages:{
        index: {
          entry: 'src/main.js',
          title: '订单管理平台'
        },
      }
}