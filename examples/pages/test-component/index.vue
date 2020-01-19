<template>
  <div>
    <test-component></test-component>
    <div>收起展开</div>
    <div class="container">
      <div class="inner" ref="inner">
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

export default {
  components: {
    testComponent,
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
    this.down()
  },

  methods: {
    up() {
      this.$refs.inner.style.height = "50px"
    },
    down() {
      const height = this.$refs.inner.scrollHeight
      console.log(height,'height')
      this.$refs.inner.style.height = `${height}px`
    },

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