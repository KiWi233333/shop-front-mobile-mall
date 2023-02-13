<template>
  <default-page title="提交订单">
    <div class="check-order" v-if="!isError"></div>
    <!-- 网络错误 -->
    <error-card
      v-else
      @refresh="$router.back()"
      btn-text="返回"
      image="error"
      text="等待超时，订单关闭！"
    />
  </default-page>
</template>
  <script>
import DefaultPage from "@/components/DefaultPage.vue";
import ErrorCard from "@/components/ErrorCard.vue";
export default {
  components: { ErrorCard, DefaultPage },
  name: "CheckOrder",
  data() {
    return { isError: false, init: {} };
  },
  mounted() {
    if (this.$route.query.info === "[object Object]")
      return (this.isError = true);
    this.info = this.$route.query.info;
  },
  methods: {
    refresh() {},
  },
};
</script>
  <style scoped>
.content {
  padding: 0.1rem 0.3rem;
}
</style>