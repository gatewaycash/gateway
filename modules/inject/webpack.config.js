const path = require('path')
require('babel-polyfill')

module.exports = {
  context: path.resolve(__dirname),
  entry: ['babel-polyfill', './inject.js'],
  output: {
    path: path.resolve(__dirname, '../website/public'),
    filename: 'pay.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['@babel/env', '@babel/react'] },
        }]
      }
    ]
  }
};
