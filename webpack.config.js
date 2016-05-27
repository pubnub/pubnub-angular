/* eslint-disable */
var webpack = require('webpack');

var config = {
  // webpack options
  devtool: 'source-map',
  entry: './src/index.js',
  module: {
    loaders: [
      { test: /\.json/, loader: 'json' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  output: {
    filename: 'pubnub-angular.js'
  },
  plugins: [
    new webpack.BannerPlugin(require('./package.json').version, {
      raw: false, entryOnly: true,
  }),
],
}

module.exports = config;
