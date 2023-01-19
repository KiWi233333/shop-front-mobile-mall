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
    <keep-alive>
      <NavBar v-if="isNavBar" />
    </keep-alive>
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
  async mounted() {
    // 导航栏显示
    this.isNavBar = this.$route.meta.lv === 1;
    // 验证用户登录状态
    const token =
      localStorage.getItem(this.$store.state.TOKEN_NAME).trim() !== ""
        ? localStorage.getItem(this.$store.state.TOKEN_NAME)
        : false;
    if (!token) return;
    const res = await checkUser(token);
    if (res.data.success) {
      console.log(res.data.data);
      this.$store.commit("setLoginState", res.data.success);
      this.$store.commit("setToken", token);
    } else {
      console.log("登录过期");
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
