<template>
  <div class="my-view">
    <!-- 顶部个人信息 -->
    <my-top :userInfo="userInfo" />
    <!-- 钱包卡片 -->
    <purse-card />
  </div>
</template>

<script>
import MyTop from "@/components/My/MyTop.vue";
import PurseCard from "@/components/My/PurseCard.vue";
export default {
  components: { MyTop, PurseCard },
  name: "MyView",
  data() {
    return {
      userInfo: this.$store.state.userInfo,
    };
  },
  methods: {},
};
</script>
<style scoped>
.my-view {
  width: 100%;
  padding: 0.4rem;
}
</style>
