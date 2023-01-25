<template>
  <div class="animate__animated animate__fadeInLeft v-card purse-card">
    <!-- 积分 -->
    <div class="top">
      <div class="left">
        <img class="bg" src="@/assets/image/icon/balance_icon.png" />
      </div>
      <div class="right">
        <label>积分卡</label>
        <span>剩余：{{ purseInfo?.recharge ?? 0 }}</span>
      </div>
    </div>
    <!-- 余额 -->
    <div class="bottom">
      <span>余额</span>
      <label><span>￥</span>{{ purseInfo?.balance ?? 0 }}</label>
      <div class="tip" @click="toPurseView($store)">
        <img src="@/assets/image/icon/coins_icon.png" class="bg" />
        <span>钱包</span>
      </div>
    </div>
  </div>
</template>
  
  <script>
import router from "@/router";
import { getPurseInfo } from "@/api/user/purse";
export default {
  name: "PurseCard",
  data() {
    return { purseInfo: {} };
  },
  async created() {
    const res = await getPurseInfo(this.$store.state.token);
    this.purseInfo = res.data.data;
  },
  methods: {
    toPurseView() {
      router.push({ name: "purse" });
    },
  },
  computed: {},
};
</script>
<style scoped>
.purse-card {
  background-color: var(--theme-color2);
  backdrop-filter: blur(20px);
  padding: 0.3rem;
  margin-top: 0.5rem;
  padding-bottom: 0;
}

span {
  font-size: 0.38rem;
  padding: 0.05rem 0;
}
.top {
  width: 52%;
  padding: 0.15rem;
  display: flex;
  align-items: center;
  background-color: var(--bg-color3);
  backdrop-filter: blur(20px);
  border-radius: 16px 16px 0 0;
  border: 1px solid var(--bg-color3);
}
.top .left .bg {
  margin: 0.1rem;
  margin-right: 0.3rem;
  width: 1.3rem;
  height: 1.3rem;
}
.top .right,
.bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--text-color);
}
.bottom {
  position: relative;
  padding: 0.3rem;
  margin-bottom: 0;
  left: -0.3rem;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-color2);
  width: calc(100% + 0.6rem);
  border-radius: 0 0 16px 16px;
}
.bottom .tip {
  box-shadow: var(--shadow-color);
  border-radius: 2rem 0 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  padding: 0.2rem 0.3rem;
  background-color: var(--bg-color4);
}
.bottom .tip .bg {
  width: 0.8rem;
  padding-right: 0.2rem;
}
</style>