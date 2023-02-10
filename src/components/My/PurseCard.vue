<template>
  <div
    class="animate__animated animate__fadeIn v-card purse-card"
    v-show="purseInfo"
  >
    <!-- 积分 -->
    <div class="v-click top animate__animated animate__slideInUp">
      <div class="left">
        <img class="bg" src="@/assets/image/icon/balance_icon.png" />
      </div>
      <div class="right" @click="toView('recharge')">
        <label>积分卡</label>
        <span>剩余:{{ purseInfo?.points || 0 }}</span>
      </div>
    </div>
    <!-- 余额 -->
    <div class="bottom">
      <span>余额</span>
      <label @click="reqPurseInfo">
        <span>￥</span>
        <label v-show="!isLodaing">{{
          Number(purseInfo?.balance).toFixed(2) || "0.00"
        }}</label>
        <van-loading
          class="load"
          v-show="isLodaing"
          color="var(--text-color)"
          size="0.6rem"
        />
      </label>
      <div class="tip" @click="toView('purse')">
        <img src="@/assets/image/icon/coins_icon.png" class="bg" />
        <span>钱包</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getPurseInfo } from "@/api/user/purse";
import { mapState } from "vuex";
export default {
  name: "PurseCard",
  data() {
    return {
      isLodaing: true,
      timer: "",
    };
  },
  // 钱包信息
  computed: { ...mapState(["purseInfo"]) },
  mounted() {
    this.reqPurseInfo(); // 请求钱包信息
  },

  methods: {
    toView(routerName) {
      this.$router.push({
        name: routerName,
        params: {
          animate: "forward",
        },
      });
    },

    // 请求钱包信息
    reqPurseInfo() {
      if (this.timer !== "") return;
      this.isLodaing = true;
      this.timer = setTimeout(async () => {
        const res = await getPurseInfo(this.$store.getters.token);
        if (res.status == 200 && res.data.success) {
          this.$store.commit("setPurseInfo", res.data.data);
          this.isLodaing = false;
          this.timer = "";
          return;
        }
        this.isError = true;
      }, 800);
    },
  },
};
</script>
<style scoped>
.purse-card {
  user-select: none;
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
  transition: 0.3s;
}
label {
  cursor: pointer;
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
  transition: 0.5s;
}
.tip:hover,
.tip:active {
  transform: scale(0.9);
  transform-origin: 100% 100%;
}
.bottom .load {
  font-weight: 600;
  display: inline-block;
}
.bottom .tip .bg {
  width: 0.8rem;
  padding-right: 0.2rem;
}
</style>