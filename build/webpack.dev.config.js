const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.common.config')

const devConfig = {
  mode: "development",
  entry: path.resolve(__dirname, "../examples/main.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "examples.js"
  },
  devServer: {
    port: 8090,
    // open: true,
    hot: true,
    ...require("../src/magic-area-plugin/server")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../examples/index.html"),
      filename: "index.html"
    }),
  ]
};

module.exports = webpackMerge(commonConfig, devConfig)
