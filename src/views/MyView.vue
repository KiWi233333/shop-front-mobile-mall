<template>
  <div class="my-view">
    <div
      class="animate__animated animate__fadeIn my-top"
      v-if="$store.state.isLoginState"
    >
      <div class="left">
        <img :src="getImage(userInfo.icon)" v-if="userInfo.icon !== ''" />
        <img
          src="@/assets/image/camera_icon.png"
          style="padding: 0.3rem"
          v-else
        />
      </div>

      <div class="right">
        <label class="title">{{ userInfo.nickname }}</label>
        <span class="userid">ID: {{ userInfo.phone }}</span>
      </div>
      <img src="@/assets/image/bg/bee_bg.png" class="bg" />
    </div>
    <div class="my-top" v-else>
      <div class="left">
        <label class="title2">欢迎您！</label>
        <span>期待你的每次到来~</span>
        <button class="v-btn tolg-btn" @click="toLoginPage">立即登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getResourImageByName } from "@/api/res";
import router from "@/router";
export default {
  name: "MyView",
  data() {
    return {
      userInfo: this.$store.state.userInfo,
    };
  },
  async mounted() {
    // 验证用户登录状态
  },
  methods: {
    // 返回静态资源地址
    getImage(url) {
      return getResourImageByName(url);
    },
    //
    toLoginPage() {
      router.push({
        name: "login",
        params: {
          animate: "forward",
        },
      });
    },
  },
  computed: {},
};
</script>
<style scoped>
.my-view {
  width: 100%;
  padding: 0.4rem 0.5rem;
}
/* 头部个人信息 */
.my-top {
  margin-top: 5vh;
  display: flex;
  align-items: center;
}
.my-top .left {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.1rem;
  padding-right: 0;
}
.my-top .left img {
  width: 1.6rem;
  height: 1.6rem;
  display: block;
  border-radius: 50%;
  background-color: var(--theme-color3);
  box-shadow: var(--shadow-color2);
  object-fit: cover;
  overflow: hidden;
  margin-right: 0.2rem;
}
.my-top .right {
  height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.1rem;
  padding-right: 0;
}
.my-top .title2 {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.2rem 0;
}
.my-top .right .title {
  width: 7em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-top .bg {
  z-index: -1;
  display: block;
  width: 5rem;
  object-fit: contain;
  position: absolute;
  right: -0.5rem;
}
.tolg-btn {
  width: 80%;
  margin: 0.2rem 0;
  padding: 0.2rem 0.1rem;
}

/* 钱包卡片 */
</style>
