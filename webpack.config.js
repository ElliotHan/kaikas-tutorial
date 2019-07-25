const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const Dotenv = require('dotenv-webpack')
const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCSS = new ExtractTextPlugin('bundle-[hash:6].css')

const ENV_DIR = './config/'
let envPath
switch (process.env.ENV) {
  case 'LOCAL':
  case 'REAL':
    envPath = ENV_DIR + `${process.env.ENV}`.toLowerCase() + '.env'
    break
}

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    path.resolve(__dirname, 'src/index.js'),
    'webpack-hot-middleware/client',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle-[hash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, 'src/styles')],
                data: '@import "./src/styles/_variables.scss";',
              },
            },
          ],
        }),
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    alias: {
      constants: path.resolve(__dirname, 'src/constants/'),
      components: path.resolve(__dirname, 'src/components/'),
      pages: path.resolve(__dirname, 'src/pages/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      klaytn: path.resolve(__dirname, 'src/klaytn/'),
      images: path.resolve(__dirname, 'static/images/'),
      actions: path.resolve(__dirname, 'redux/actions/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      inject: 'body',
    }),
    extractCSS,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv({
      path: envPath,
    }),
    new HotModuleReplacementPlugin(),
  ],
  node: {
    fs: 'empty',
  },
}
