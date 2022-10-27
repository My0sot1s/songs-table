const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/user': {
        target: 'https://songs.sends.cc'
      },
      '/admin': {
        target: 'https://songs.sends.cc'
      }
    }
  }
  // lintOnSave: false
})
