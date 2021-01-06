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
  // {
  //   path: "/auto-click",
  //   name: "autoClick",
  //   meta: {
  //     title: "自动页面交互"
  //   },
  //   component: autoClick
  // },
  // {
  //   path: "/xy-list",
  //   name: "xyList",
  //   meta: {
  //     title: "xy列表"
  //   },
  //   component: xyList
  // },
  {
    path: "/source",
    name: 'source',
    meta: {
      title: "souce"
    },
    redirect: '/source/to-code',
    component: ()=>import('@examples/pages/source-to-route/layout.vue'),
    children: [
      {
        path: "to-code",
        name: 'toCode',
        meta: {
          title: "to-code"
        },
        component: ()=>import('@examples/pages/source-to-route/index.vue'),
      }
    ]
  },
];
