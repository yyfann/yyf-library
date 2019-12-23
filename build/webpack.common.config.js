const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//项目根目录
var projectDir = path.join(__dirname, '..');

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
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          exposeFilename: true,
        }
      },
      {
        test: /\.pug$/,
        loader: "pug-html-loader"
      },
      {
        test: /\.less$/,
        loader: ["style-loader", "css-loader", "less-loader"]
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
          presets: [["@babel/preset-env"]],
          plugins: [
            ["@babel/plugin-transform-runtime"]
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
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ]
};
