
const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'yyf-test-library.js',
    // 让打包后的js文件支持 es6 module ,commonjs, amd 的引入方式
    libraryTarget: 'umd',
    // 支持用script标签的src方式引入, 并将yyfTestLibrary指向此库, 并增加到业务代码的环境变量中
    library: 'yyfTestLibrary',
  },
}