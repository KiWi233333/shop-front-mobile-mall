<template>
  <div class="my-view">
    <div class="my-top" v-if="$store.state.isLoginState">
      <div class="left">
        <img :src="getImage(userInfo.icon)" v-if="userInfo.icon !== ''" />
        <img src="@/assets/image/camera_icon.png" v-else />
      </div>
      <div class="right">
        <label class="title">{{ userInfo.nickname }}</label>
        <span class="userid">ID: {{ userInfo.phone }}</span>
      </div>
    </div>
    <div class="my-top" v-else>
      <div class="left"></div>
      <div class="right">
        <label class="title">未登录</label>
      </div>
    </div>
  </div>
</template>

<script>
import { getResourImageByName } from "@/api/res";
export default {
  name: "MyView",
  data() {
    return {
      userInfo: this.$store.state.userInfo,
    };
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
  },
  methods: {
    // 返回静态资源地址
    getImage(url) {
      return getResourImageByName(url);
    },
  },
  computed: {},
};
</script>
<style scoped>
.my-view {
  width: 100%;
  padding: 0.4rem 0.3rem;
}
/* 头部 */
.my-top {
  display: flex;
  align-items: center;
}
.my-top .left img {
  width: 2rem;
  height: 2rem;
  display: block;
  border-radius: 50%;
  background-color: var(--theme-color3);
  box-shadow: var(--shadow-color);
  object-fit: cover;
  overflow: hidden;
}
.my-top .right {
  height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.2rem;
  padding-right: 0;
}
.my-top .right .title {
  width: 8em;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
