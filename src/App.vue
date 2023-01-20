<template>
  <div id="app">
    <transition :name="routerAnimate">
      <router-view />
    </transition>
    <!-- 1)需缓存页面 -->
    <keep-alive>
      <router-view v-if="keepAlive" />
    </keep-alive>
    <!-- 2)无需缓存页面 -->
    <router-view v-if="keepAlive" />
    <!-- 底部导航栏 -->
    <NavBar v-if="isNavBar" />
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";
import { checkUser } from "@/api/users";
export default {
  components: { NavBar },
  data() {
    return {
      routerAnimate: "forward",
      keepAlive: false,
      isNavBar: false,
    };
  },
  async created() {
    // 导航栏显示
    this.isNavBar = !(this.$route.meta.lv !== 1);
    // 验证用户登录状态
    const token =
      localStorage.getItem(this.$store.state.TOKEN_NAME) !== "" // 获取token
        ? localStorage.getItem(this.$store.state.TOKEN_NAME)
        : false;
    console.log(token);
    if (!token) return;
    const res = await checkUser(token); // 验证token
    if (res.data.success) {
      console.log(res.data.data);
      this.$store.commit("setUserInfo", res.data.data);
      this.$store.commit("setLoginState", res.data.success);
      this.$store.commit("setToken", token);
    }
  },
  watch: {
    $route(to) {
      if (to.params.animate === "forward") {
        this.routerAnimate = "forward";
      } else if (to.params.animate === "toback") {
        this.routerAnimate = "toback";
      } else {
        this.routerAnimate = "";
      }
      // 导航栏显示
      this.isNavBar = !(to.meta.lv !== 1);
    },
  },
};
</script>
<style>
@import url(../public/css/default.css);
/* 前进 */
.forward-enter-active,
.forward-leave-active {
  width: 100%;
  transition: all 0.8s;
  position: absolute;
  opacity: 1;
}

.forward-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.forward-enter {
  opacity: 0;
  transform: translateX(100%);
}

/* 返回动画 */
.toback-enter-active,
.toback-leave-active {
  opacity: 1;
  transition: all 0.8s;
  position: absolute;
  width: 100%;
}
.toback-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toback-enter {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
