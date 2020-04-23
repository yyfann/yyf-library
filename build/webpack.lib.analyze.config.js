const webpackMerge = require('webpack-merge')
const libConfig = require('./webpack.lib.config')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const analyzeConfig = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    concatenateModules: false,
  }
};

module.exports = webpackMerge(libConfig, analyzeConfig)

