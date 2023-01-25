<template>
  <div class="v-click item">
    <span>{{ title }}</span>
    <van-icon name="arrow" size="0.42rem" />
  </div>
</template>
<script>
import router from "@/router";
export default {
  props: ["title", "targetName"],
  name: "MenuItem",
  methods: {
    toView() {
      router.push({
        name: "",
      });
    },
  },
};
</script>
<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.3rem 0.2rem;
  cursor: pointer;
}
.item span {
  font-size: 0.4rem;
  font-weight: 600;
}
</style>