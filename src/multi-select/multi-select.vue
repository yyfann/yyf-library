<template>
  <div class="tag-select">
    <div
      :class="selectedValues.indexOf(option.value) !== -1 ? 'active' : 'normal'"
      :key="optionIndex"
      @click="selectItem(option.value)"
      class="item"
      v-for="(option, optionIndex) in options"
    >{{option.label}}</div>
  </div>
</template>

<script>
export default {
  props: {
    // 单选: single / 多选: multi
    mode: {
      type: String,
      default: "single"
    },

    /**
     * 全部可选项数组
     */
    options: {
      type: Array,
      default: () => []
    },

    /**
     * 预设的选中值, 支持.sync
     */
    values: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      selectedValues: [],
      tagColors: {
        normal: "",
        active: "blue"
      }
    };
  },

  watch: {
    values: {
      handler() {
        this.selectedValues = _.cloneDeep(this.values)
      },
      immediate: true,
    }
  },

  methods: {
    selectItem(item) {
      switch (this.mode) {
        case "multi":
          if (this.selectedValues.indexOf(item) === -1) {
            this.selectedValues.push(item);
          } else {
            this.selectedValues.splice(this.selectedValues.indexOf(item), 1);
          }
          break;

        case "single":
          this.selectedValues = [];
          this.selectedValues.push(item);
          break;

        default:
          break;
      }

      this.change();
    },

    change() {
      const output =
        this.mode === "single" ? this.selectedValues[0] : this.selectedValues;
      this.$emit("update:values", output);
    }
  }
};
</script>

<style lang="less" scoped>
.tag-select {
  .item {
    margin: 5px;
    border-radius: 5px;
    cursor: pointer
  }
  .normal {
    background: LightSkyBlue;
  }
  .active {
    background: DodgerBlue;
    color: AliceBlue;
  }
}
</style>



