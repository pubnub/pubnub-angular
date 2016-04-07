/* eslint-disable */

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
    filename: '<%= pkg.name %>-<%= pkg.version %>.js'
  }
}

module.exports = config;
