const path = require("path");

const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common.config')


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
};

module.exports = webpackMerge(commonConfig, libConfig)

