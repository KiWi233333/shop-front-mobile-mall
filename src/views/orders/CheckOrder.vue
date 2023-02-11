<template>
  <div class="collect-view">
    <top-nav title="确认订单" @click-left="$router.back()" />
    <div class="content"></div>
  </div>
</template>
  <script>
import TopNav from "@/components/TopNav.vue";
export default {
  components: { TopNav },
  name: "CollectView",
  data() {
    return {};
  },
};
</script>
  <style scoped>
.content {
  padding: 0.1rem 0.3rem;
}
</style>