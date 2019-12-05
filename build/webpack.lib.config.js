const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

var projectDir = path.join(__dirname, '..');

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  mode: 'production',
  // externals: {
  //   vue: {
  //     root: "Vue",
  //     commonjs: "vue",
  //     commonjs2: "vue",
  //     amd: "vue"
  //   },
  // },
  // externals: ["lodash"],
  output: {
    path: path.resolve(__dirname, "../lib"),
    filename: "yyf-library.js",
    library: "yyfLibrary",
    globalObject: "this",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "@src": path.join(projectDir, "src"),
      "@example": path.join(projectDir, "examples"),
      vue$: "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [["@babel/preset-env"]]
        }
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
  ]
};
