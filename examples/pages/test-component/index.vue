<template>
  <div>
    <test-component></test-component>
    
    <el-button
      @click="screenShot"
      size="small"
    >截图</el-button>
    <div class="main">截图啊</div>

    <div>收起展开</div>
    <div class="container">
      <div
        class="inner"
        ref="inner"
      >
        <div
          :key="itemIndex"
          class="item"
          v-for="(item, itemIndex) in list"
        >{{ item.label }}</div>
      </div>
      <button @click="up">收起</button>
      <button @click="down">展开</button>
    </div>
  </div>
</template>

<script>
import testComponent from "@src/test-component/index.vue";
import html2canvas from "html2canvas";

export default {
  components: {
    testComponent
  },
  data() {
    return {
      list: _.range(1, 5).map(i => ({
        value: i,
        label: `${i}`
      }))
    };
  },

  mounted() {
    this.down();
  },
  

  methods: {
    screenShot() {
      html2canvas(document.querySelector(".main")).then(canvas => {
        const link = document.createElement("a"); // 创建一个超链接对象实例
        const event = new MouseEvent("click"); // 创建一个鼠标事件的实例
        link.download = "Button.png"; // 设置要下载的图片的名称
        link.href = canvas.toDataURL(); // 将图片的URL设置到超链接的href中
        link.dispatchEvent(event); // 触发超链接的点击事件
      });
    },
    up() {
      this.$refs.inner.style.height = "50px";
    },
    down() {
      const height = this.$refs.inner.scrollHeight;
      console.log(height, "height");
      this.$refs.inner.style.height = `${height}px`;
    }
  }
};
</script>

<style lang="sass" scoped>
  .container
    .inner
      overflow: hidden
      transition: 1s
      .item
        padding: 20px
        background: wheat
        border: 1px solid #000
</style>