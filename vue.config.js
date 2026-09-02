module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.module
      .rule('pdf')
      .test(/\.pdf$/)
      .set('type', 'asset/resource')
      .set('generator', {
        filename: 'pdf/[name].[hash:8][ext]'
      })
  }
}
