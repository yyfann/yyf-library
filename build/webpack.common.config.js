const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

//项目根目录
var projectDir = path.join(__dirname, '..');

let MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
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
        test: /\.pug$/,
        loader: "pug-html-loader"
      },
      {
        test: /\.less$/,
        loader: ["style-loader", "css-loader", "less-loader"]
        // loader: [
        //   MiniCssExtractPlugin.loader
        //   , "css-loader", "less-loader"]
      },
      {
        test: /\.sass$/,
        loaders: ["style-loader", "css-loader", {
          loader: "sass-loader",
          options: {
            indentedSyntax: true
          }
        }]
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            // 'babel-plugin-lodash',
            "@babel/plugin-transform-runtime",
          ]
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
      },
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'main.css'
    // }),

    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    // new LodashModuleReplacementPlugin(),
  ]
};
