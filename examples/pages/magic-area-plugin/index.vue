<template>
  <div>
    <button @click="fn">打开面板</button>
  </div>
</template>

<script>
import Vue from 'vue'
import router from '../../router/router'
import magicAreaPluginClient from '@src/magic-area-plugin/client.js'
import routerRawDatas from '../../router/routes/main-routes'

// 路由映射配置
const routeDatas = routerRawDatas.map((routerRawData) => {
  return {
    name: routerRawData.meta.title,
    index: routerRawData.path,
  }
})

// devServer 的端口号
const devServerPort = 8090

export default {
  components: {
  },
  data() {
    return {
      
    }
  },

  methods: {
    fn() {
      magicAreaPluginClient(Vue, router, routeDatas, devServerPort);
    },
  },
}
</script>

<style scoped>

</style>