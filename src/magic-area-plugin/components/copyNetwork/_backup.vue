 <!-- <div
        class="responses-area"
        style="background: #292c33"
        v-show="showAreas.includes('quick-network')"
      >
        <json-viewer
          :expand-depth="2"
          :value="responsesJson"
          style="background: wheat"
        ></json-viewer>
        <tree-view
          :data="responsesJson"
          :options="{maxDepth: 3}"
          style="background: wheat"
        ></tree-view>
        <json-view
          :data="responsesJson"
          :deep="5"
          style="background: #292c33"
          theme="one-dark"
        ></json-view>
      </div>-->

      // responsesJson() {
    //   // 数组的形式
    //   // return this.responses.map(({data, config}) => {
    //   //   return {
    //   //     url: config.url,
    //   //     pageData: data.resultObject.pageData
    //   //   }
    //   // })

    //   // console.log(this.responses,'this.responses')

    //   // 对象的形式
    //   const obj = this.responses.reduce((obj, item) => {
    //     if (_.get(item, "data.resultObject")) {
    //       obj[item.config.url] = item.data.resultObject.pageData;
    //     }
    //     return obj;
    //   }, {});
    //   return obj;
    // }