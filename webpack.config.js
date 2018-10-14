const path = require('path')

const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SriPlugin = require('webpack-subresource-integrity')

const exclude = /(node_modules|tests|public)/

const config = {
  devtool: 'source-map',
  entry: {
    paysite: './src/paySite/index.js',
    pay:     './src/payButton/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    crossOriginLoading: 'anonymous'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: [
                ["@babel/plugin-proposal-class-properties"]
              ]
            }
          }
        ],
        exclude: exclude
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true
              }
            }
          ]
        }),
        exclude: exclude
      },
      {
        test: /\.(png|jpg|ico|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ],
        exclude: exclude
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ],
        exclude: exclude
      },
      {
        test: /\.txt$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ],
        exclude: exclude
      },
      {
        test: /\.(mp3|wav|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'audio/'
            }
          }
        ],
        exclude: exclude
      }
    ]
  },
  plugins: [
    // disable CleanWebpackPlugin in cases of preformance issues
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/paySite/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['paysite']
    }),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true // disable if opening file:// URLs with a browser locally
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, 'src/paySite/res/background.svg'),
      prefix: 'icons/',
      inject: true,
      background: '#223',
      title: 'Unite',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      }
    }),
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath('paysite.css')
      }
    }),
    new webpack.DefinePlugin({
      '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
    })
  ],
  node: {
    fs: 'empty'
  }
}

module.exports = config
