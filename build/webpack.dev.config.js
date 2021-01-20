const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.common.config')

const devConfig = {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname, "../examples/main.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "examples.js"
  },
  devServer: {
    port: 8090,
    // open: true,
    hot: false,
    ...require("../src/magic-area-plugin/server")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              exposeFilename: true,
            }
          },
          {
            loader: path.resolve(__dirname, '../src/magic-area-plugin/add-element-location-loader.js'),
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../examples/index.html"),
      filename: "index.html"
    }),
  ]
};

module.exports = webpackMerge(commonConfig, devConfig)
