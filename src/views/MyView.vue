
<template>
  <div class="wind-init my-view">
    <!-- 顶部个人信息 -->
    <my-top :userInfo="userInfo" />
    <!-- 钱包卡片 -->
    <purse-card v-if="$store.state.isLoginState" />
    <!-- 卡片组 -->
    <card-group />
    <!-- 菜单栏列表 -->
    <menu-list v-if="$store.state.isLoginState" />
    <!-- 了解更多 -->
    <span
      v-if="!$store.state.isLoginState"
      class="animate__animated animate__fadeIn bottom-span"
      >————— 登录了解更多 —————</span
    >
  </div>
</template>

<script>
import MyTop from "@/components/My/MyTop.vue";
import PurseCard from "@/components/My/PurseCard.vue";
import CardGroup from "@/components/My/CardGroup.vue";
import MenuList from "@/components/My/MenuList.vue";
export default {
  components: { MyTop, PurseCard, CardGroup, MenuList },
  name: "MyView",
  data() {
    return {
      userInfo: this.$store.state.userInfo,
    };
  },
};
</script>
<style scoped>
.my-view {
  user-select: none;
}
.bottom-span {
  animation-delay: var(--router-delay);
  display: block;
  width: 100%;
  text-align: center;
  font-size: 0.32rem;
  color: var(--bg-color3);
  margin: 0.4rem 0;
}
</style>
