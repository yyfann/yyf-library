const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 8090,
  },
  // externals: ['lodash'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'yyf-test-library.js',
    library: 'yyfTestLibrary',
    globalObject: 'this',
    libraryTarget: 'umd',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      // chunks: ['index'],
    }),
  ],
}