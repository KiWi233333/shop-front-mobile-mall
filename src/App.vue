<template>
  <div id="app">
    <!-- 过渡动画 -->
    <transition :name="routerAnimate">
      <!-- 1)需缓存页面 -->
      <keep-alive v-if="keepAlive">
        <router-view />
      </keep-alive>
      <!-- 2)无需缓存页面 -->
      <router-view v-if="!keepAlive" />
    </transition>
    <!-- 底部导航栏 -->
    <NavBar v-show="isNavBar" />
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";
import { checkUser } from "@/api/user/users";
export default {
  components: { NavBar },
  data() {
    return {
      routerAnimate: "toback",
      keepAlive: false,
      isNavBar: false,
    };
  },
  created() {
    // 导航栏显示
    this.isNavBar = !(this.$route.meta.lv !== 1);
    // 验证用户登录状态
    const token =
      localStorage.getItem(this.$store.state.TOKEN_NAME) ||
      sessionStorage.getItem(this.$store.state.TOKEN_NAME);
    if (!token) return;
    // 请求
    checkUser(token)
      .then((res) => {
        if (res.data.success) {
          // 初始化store
          this.$store.commit("setUserInfo", res.data.data);
          this.$store.commit("setLoginState", res.data.success);
          this.$store.commit("setToken", token);
          this.$store.commit(
            "setLoginTime",
            +localStorage.getItem("loginTime")
          ); // 设置初始登录时间
        }
      })
      .catch(() => {
        this.$store.commit("loginOut");
      }); // 验证token
  },
  watch: {
    // 监控路由并添加动画
    $route(to) {
      // 修改标题
      this.keepAlive = to.meta?.keepAlive ?? false;
      if (to.params?.animate) {
        this.routerAnimate = to.params.animate;
      } else {
        this.routerAnimate = "toback";
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
  transition: all var(--router-delay);
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
  transition: all var(--router-delay);
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
/* 上拉 */
.toup-enter-active,
.toup-leave-active {
  opacity: 1;
  transition: all calc(var(--router-delay) * 2);
  position: absolute;
  width: 100%;
}
.toup-leave-to {
  opacity: 0;
  transform: translateY(-100%) scale(0.6);
  border-radius: 4rem;
  overflow: hidden;
  filter: blur(20px);
  box-shadow: var(--shadow-color2);
}
.toup-enter {
  opacity: 0;
  transform: translateY(100%) scale(1);
}
</style>
