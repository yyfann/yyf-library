<template>
  <div>
    <button>{{ content }}</button>
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