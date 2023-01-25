
<template>
  <div class="my-view">
    <!-- 顶部个人信息 -->
    <my-top :userInfo="userInfo" />
    <!-- 钱包卡片 -->
    <purse-card v-if="$store.state.isLoginState" />
    <!-- 卡片组 -->
    <card-group />
  </div>
</template>

<script>
import MyTop from "@/components/My/MyTop.vue";
import PurseCard from "@/components/My/PurseCard.vue";

import { checkUser } from "@/api/user/users";
import CardGroup from "@/components/My/CardGroup.vue";
export default {
  components: { MyTop, PurseCard, CardGroup },
  name: "MyView",
  data() {
    return {
      userInfo: this.$store.state.userInfo,
    };
  },
  async created() {
    // 验证用户登录状态
    const token =
      localStorage.getItem(this.$store.state.TOKEN_NAME) ||
      sessionStorage.getItem(this.$store.state.TOKEN_NAME);
    if (!token) return;
    const res = await checkUser(token); // 验证token
    console.log(res.data.data, token);
    if (res.data.success) {
      this.$store.commit("setUserInfo", res.data.data);
      this.$store.commit("setLoginState", res.data.success);
      this.$store.commit("setToken", token);
    }
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
