const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/user': {
        target: 'http://175.178.162.207:9090'
      },
      '/admin': {
        target: 'http://175.178.162.207:9090'
      }
    }
  }
  // lintOnSave: false
})
