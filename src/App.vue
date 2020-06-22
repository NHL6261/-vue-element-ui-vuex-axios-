<template>
    <router-view />
</template>

<script type="text/ecmascript-6">
export default {
  created() {
    this.eliminate()
  },
  methods: {
    eliminate: function() {
      let loading = document.getElementById("Loading");
      if (loading != null) {
        document.body.removeChild(loading);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>