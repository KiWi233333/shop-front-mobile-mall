<template>
  <div></div>
</template>
<script>
export default {
  props: {
    item: { required: false, default: {} }, // 地址信息
  },
  name: "AddressPopup",
  mounted() {
    this.item;
  },
};
</script>
<style lang="less" scoped>
</style> 