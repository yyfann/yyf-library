const path = require("path");

const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.config')
const components = require('./config/components')

const libConfig = {
  mode: 'production',
  entry: components,
  output: {
    path: path.resolve(__dirname, "../lib"),
    filename: '[name].js',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ]
  },
};

module.exports = webpackMerge(commonConfig, libConfig)

