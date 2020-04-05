module.exports = {
  client: {
    root: 'app',

    webpackConfig: 'webpack.config.babel.js',

    html: {
      template: 'index.pug',
      filename: 'index.html',
      title: '',
      inject: true,
    },

    output: {
      root: '',
      publicPath: './',

      assetManifest: {
        fileName: '',
      },
    },
  },
};
