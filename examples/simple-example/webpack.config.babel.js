import path from 'path';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import clientConfigJs from '@vzh/configs/webpack/client.config';
import paths from '@vzh/configs/paths';

export default webpackMerge(clientConfigJs({ entry: { main: './index' } }), {
  module: {
    rules: [{ test: /\.pug$/, use: { loader: 'pug-loader' } }],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.client.sources, 'index.pug'),
      hash: true,
    }),
  ],

  devServer: {
    publicPath: '/',
  },
});
