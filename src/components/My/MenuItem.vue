<template>
  <div class="v-click item" @click="toView">
    <span class="title">{{ title }}</span>
    <div class="flex-center-center right">
      <span>{{ value }}</span>
      <slot></slot>
      <van-icon name="arrow" size="0.42rem" />
    </div>
  </div>
</template>
<script>
import router from "@/router";
export default {
  props: ["title", "targetName", "value"],
  name: "MenuItem",
  methods: {
    toView() {
      if (this.targetName) {
        router.push({
          name: this.targetName ?? "my",
          params: {
            animate: "forward",
          },
        });
      }
    },
  },
};
</script>
<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4rem;
  cursor: pointer;
}
.item .title,
.item .right span {
  font-size: 0.4rem;
  letter-spacing: 0.05em;
  font-weight: 600;
  padding-right: 0.1rem;
}
</style>