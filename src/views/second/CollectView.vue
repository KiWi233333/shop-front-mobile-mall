<template>
  <div class="collect-view">
    <top-nav title="我的收藏" @click-left="$router.back()" />
    <div class="content">
      <collect-list />
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/TopNav.vue";
import CollectList from "@/components/CollectList.vue";
export default {
  components: { TopNav, CollectList },
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