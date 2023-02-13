<template>
  <!-- 网络错误 -->
  <van-empty
    class="error"
    image-size="3rem"
    :image="image"
    :description="text || '请稍后再试！'"
  >
    <button class="v-btn" @click="reqHttp">{{ btnText || "刷新" }}</button>
  </van-empty>
</template>
<script>
export default {
  name: "ErrorCard",
  props: ["image", "text", "btnText"],
  methods: {
    reqHttp() {
      this.timer = setTimeout(() => {
        this.$emit("refresh");
      }, 500);
    },
  },
};
</script>
<style scoped>
/* 空白框重新定义 */
.van-empty {
  width: 100%;
  font-size: 0.4rem;
}
.van-empty .v-btn {
  font-size: 0.35rem;
  padding: 0.12rem 0.6rem;
}
.van-empty >>> .van-empty__description {
  font-size: 0.36rem;
}
</style>