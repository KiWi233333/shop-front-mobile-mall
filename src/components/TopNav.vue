<template>
  <div class="top-nav">
    <div class="left" @click="onClickLeft">
      <van-icon name="arrow-left" size="0.6rem" />
    </div>
    <div class="title" v-text="title"></div>
    <div class="right" v-text="rTitle" @click="onClickRight"></div>
  </div>
</template>
<script>
export default {
  name: "TopNav",
  props: ["title", "rTitle"],
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$emit("click-left");
    },
    onClickRight() {
      this.$emit("click-right");
    },
  },
};
</script>
<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.4rem;
  font-size: 0.4rem;
  /* border-bottom: 1px solid var(--bg-color3); */
  position: relative;
}
.top-nav .title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  font-weight: 600;
}
.top-nav .right,
.top-nav .left {
  cursor: pointer;
}
</style>
