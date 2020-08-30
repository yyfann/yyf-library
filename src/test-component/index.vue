<template>
  <div>
    <el-button>{{ content }}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    }
  },
}
</script>