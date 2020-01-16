const path = require("path");

const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.config')
const CopyPlugin = require('copy-webpack-plugin');

const libConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../lib"),
    filename: "yyf-library.js",
    library: "yyfLibrary",
    globalObject: "this",
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
  plugins: [
    new CopyPlugin([
      {
        from: 'src/magic-area-plugin/add-element-location-loader.js',
        to: 'magic-area-plugin/',
      },
      {
        from: 'src/magic-area-plugin/server.js',
        to: 'magic-area-plugin/',
      },
    ]),
  ]
};

module.exports = webpackMerge(commonConfig, libConfig)

