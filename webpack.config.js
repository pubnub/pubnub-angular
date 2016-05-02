/* eslint-disable */
var webpack = require('webpack');

config = {
  // webpack options
  entry: './src/index.js',
  module: {
    loaders: [
      { test: /\.json/, loader: 'json' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  output: {
    path: './dist',
    filename: '<%= pkg.name %>.js'
  },
  plugins: [
    new webpack.BannerPlugin(require('./package.json').version, {
      raw: false, entryOnly: true,
  }),
],
}

module.exports = config;
