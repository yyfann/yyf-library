const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


//项目根目录
var projectDir = path.join(__dirname, '..');

module.exports = {
  entry: path.resolve(__dirname, "../examples/main.js"),
  mode: "development",
  devServer: {
    port: 8090,
    ...require("../src/magic-area-plugin/server")
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "examples.js"
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../examples/index.html"),
      filename: "index.html"
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ]
};
