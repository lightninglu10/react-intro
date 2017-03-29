'use strict';

var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')

var sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './client')
];

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './client/index.dev.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    publicPath: 'http://localhost:3000/',
  },
  module: {
    rules: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'client'),
        loader: "babel-loader",
        query: {
          presets: ['react', 'latest', 'stage-2'],
          "plugins": ["transform-decorators-legacy", "react-hot-loader/babel"]
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: sassLoaders.join('!')})
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({debug: true}),
    new CleanWebpackPlugin(['dist'], { root: __dirname }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new CopyWebpackPlugin([{ from: 'client/assets' }]),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      filename: 'index.html',
      inject: 'body' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    })
  ],
};
