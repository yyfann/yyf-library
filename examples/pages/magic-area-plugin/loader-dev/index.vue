<template>
  <div
    @aC="2"
    a="1"
    a.sync="2"
    aB="2"
  ></div>
  <svg-icon
    :iconClass="iconHide"
    class="toggle-icon"
    v-if="scope.row.show === '0'"
  ></svg-icon>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  async mounted() {},

  methods: {}
};
</script>

<style scoped>
</style>