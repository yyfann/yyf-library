# magic-area-plugin

##  功能
### 1 点击页面打开源码

### 2 mock接口

### 3 操作面板

#### 1 路由搜索

#### 1 多用户登录&储存



### 



##  原理
1 vue端: 在vue应用内添加一个面板组件, 内部解析当前组件对应的源码文件路径

2 devServer端: 通过增加webpack.devServer的相关配置, 让其内置的express服务器提供一个接口, 这个接口用于调用vscode打开源码

3 两端使用 axios 进行请求操作

##  使用前提
安装了vscode, 并可以使用 'code' 全局命令用vscode打开文件


##  配置

### main.js
#### 1 只用定位源码的最简配置

```javascript
import Vue from 'vue'
import { magicAreaPluginClient } from "yyf-library/lib/yyf-library";
new magicAreaPluginClient(Vue);
```



#### 2 标准配置

```javascript
import { magicAreaPluginClient } from "yyf-library/lib/yyf-library";
// 路由映射配置
const routeDatas = [
  {
    name: '页面1',  // 路由名称
    index: 'page1'  // 路由的path
  }
]
magicAreaPluginClient(Vue, router, routeDatas);


```

#### 3 禧云数科项目示例
```javascript
import menuDatas from "@src/config/menu.js";

const routeDatas = menuDatas
    .map(menuData => {
    return menuData.sub;
    })
    .flat()
    .filter(x => x);
    
magicAreaPluginClient(Vue, router, routeDatas);
```

### devServer

#### 1 原生webpack

```javascript
module.exports = {
  devServer: {
    // 增添这一行
    ...require("yyf-library/src/magic-area-plugin/server")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        // 让组件都有一个相对路径
        options: {
          exposeFilename: true,
        }
      },
    ]
  }
}
```

#### 2 vue-cli3

```javascript
const addElementLocationLoader = 'yyf-library/lib/magic-area-plugin/add-element-location-loader'
module.exports = {
  devServer: { // 开发环境下的配置
    ...require("yyf-library/lib/magic-area-plugin/server")
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    // 防止eslint下: No ESLint configuration found 报错
    config.resolve.symlinks(false)
    // 配置loader
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.exposeFilename = true
        return options
      })
      .end()
      .use(addElementLocationLoader)
      .loader(addElementLocationLoader)
      .end()
  },
}

```



##  使用

1 在面板的input框输入路由的name
2 跳转路由
3 打开源码
4 ctrl + m 切换隐藏显示面板

##  TODO (欢迎pr)

1 面板的拖拽
2 支持其他编辑器



