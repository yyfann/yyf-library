const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


module.exports = {
  entry: path.resolve(__dirname, "../example/index.js"),
  mode: "development",
  devServer: {
    port: 8090
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "yyf-library.js"
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
      template: "./src/index.html",
      filename: "index.html"
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
  ]
};
