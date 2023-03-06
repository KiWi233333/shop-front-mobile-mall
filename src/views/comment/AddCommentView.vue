<template>
  <!-- 导航 -->
  <top-nav title="评论" class="top-nav" @click-left="$router.back()">
    <template #rblock>
      <button class="v-btn submit-btn" @click="submitComment">提交</button>
    </template>
  </top-nav>
</template>
  
  <script>
import TopNav from "@/components/TopNav.vue";
export default {
  components: { TopNav },
  name: "AddCommentView",
  data() {
    return {
      id: "",
    };
  },
  mounted() {
    // 获取订单id
    if (this.$route.query?.id) {
      this.id = this.$route.query?.id;
    }
  },
  methods: {
    submitComment() {},
  },
};
</script>
<style scpoed>
/* 顶部导航 */
.top-nav .submit-btn {
  width: auto;
  border-radius: 6px;
  padding: 0.05rem 0.15rem;
  padding-left: 0.2rem;
  font-size: 0.3rem;
  text-align: center;
  box-shadow: none;
}
</style>