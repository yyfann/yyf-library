import testComponent from "../../pages/test-component/index.vue";
import autoClick from "../../pages/auto-click/index.vue";
import xyList from "../../pages/xy-list/index.vue";


export default [
  {
    path: "/test-component",
    name: "testComponent",
    meta: {
      title: "测试组件"
    },
    component: testComponent
  },
  {
    path: "/auto-click",
    name: "autoClick",
    meta: {
      title: "自动页面交互"
    },
    component: autoClick
  },
  {
    path: "/xy-list",
    name: "xyList",
    meta: {
      title: "xy列表"
    },
    component: xyList
  },
];
