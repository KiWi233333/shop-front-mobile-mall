<template>
  <div class="view">
    <top-nav :title="title" @click-left="$router.back()" />
    <div class="content">
      <!-- 内容 -->
      <slot></slot>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/TopNav.vue";
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: "",
      required: false,
    },
  },
  components: { TopNav },
  name: "DefaultPage",
};
</script>
<style scoped>
.content {
  padding: 0.1rem 0.3rem;
}
</style>