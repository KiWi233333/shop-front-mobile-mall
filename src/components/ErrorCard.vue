<template>
  <!-- 网络错误 -->
  <van-empty
    class="error"
    image-size="3rem"
    :image="image"
    :description="text || '请稍后再试！'"
  >
    <button type="submit" class="v-btn" @click="reqHttp">
      <span v-show="!isLoading">{{ btnText || "刷新" }}</span>
      <van-loading
        type="spinner"
        color="var(--text-color)"
        v-show="isLoading"
        size="0.6rem"
      />
    </button>
  </van-empty>
</template>
<script>
export default {
  name: "ErrorCard",
  props: ["image", "text", "btnText"],
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    reqHttp() {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        this.$emit("refresh");
        this.isLoading = false;
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
  box-sizing: border-box;
  width: 2rem;
  height: 1rem;
  padding: 0.1rem;
  font-size: 0.3rem;
}
.van-empty >>> .van-empty__description {
  font-size: 0.36rem;
}
</style>