# magic-area-plugin

##  功能
### 1 点击页面打开源码

ctrl + 左键/右键 打开页面元素所在的源码

### 2 mock接口

通过devServer提供接口

### 3 操作面板

#### 路由搜索

#### 多用户登录&储存

#### 用户名下的常用路由

输入框的语法:

```javascript
内置路由名,
自定义名称1: /path1,
自定义名称2: /path2,
```

tip:

内置路由名: routeDatas里面包含的名字



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
new magicAreaPluginClient(Vue, router, routeDatas);


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
    
new magicAreaPluginClient(Vue, router, routeDatas);
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

module.exports = {
  devServer: { // 开发环境下的配置
    ...require("yyf-library/lib/magic-area-plugin/server")
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    // 防止eslint下: No ESLint configuration found 报错
    config.resolve.symlinks(false)
    // 配置loader
    const addElementLocationLoader = 'yyf-library/lib/magic-area-plugin/add-element-location-loader'
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

##  坑

### 业务代码的 html 属性需要规范

由于 loader 会重新解析标签，所以标签的 html 属性务必要用规范的 kabe-case ，否则会导致编译问题(parse5会无脑将props全转为小写)

```html
// 正确    
<div custom-prop="xxx">1</div>
// 错误
<div customProp="xxx">1</div>

```

### 自定义组件不能有非闭合标签 (可选)

tip: 这里loader内部其实会处理一下, 不用非遵守

所有的标签必须闭合

```html
    <my-comp
      type="text"
    /></my-comp>
```

原生的标签可以不闭合

```html
<br>
<img/>
```

### 组件名不能和html原生标签一致

<header></header> 类似的不可以作为自定义组件名


##  TODO (欢迎pr)

1 面板的拖拽
2 支持其他编辑器



