# magic-area-plugin

##  功能
提供一个控制面板, 可以在前端页面直接操作vscode打开源码

##  原理
1 vue端: 在vue应用内添加一个面板组件, 内部解析当前组件对应的源码文件路径

2 devServer端: 通过增加webpack.devServer的相关配置, 让其内置的express服务器提供一个接口, 这个接口用于调用vscode打开源码

3 两端使用 axios 进行请求操作

##  使用前提
安装了vscode, 并可以使用 'code' 全局命令用vscode打开文件


##  配置

### vue端
main.js

```javascript
import { magicAreaPluginClient } from "yyf-library/lib/yyf-library";
// 路由映射配置
const routeDatas = [
  {
    name: '页面1',  // 路由名称
    index: 'page1'  // 路由的path
  }
]
// devServer 的端口号
const devServerPort = 8080
magicAreaPluginClient(Vue, router, routeDatas, devServerPort);


```

#### 禧云数科项目 useage
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

### devServer端

找到devServer的配置
```javascript
module.exports = {
  devServer: {
    // 增添这一行
    ...require("yyf-library/src/magic-area-plugin/server")
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



