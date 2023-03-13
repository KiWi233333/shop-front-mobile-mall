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
        if (res.data.code === 20011) {
          // 初始化store
          this.$store.commit("setUserInfo", res.data.data);
          this.$store.commit("setLoginState", res.data.code === 20011);
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
    $route(to, from) {
      // 修改标题
      this.keepAlive = to.meta?.keepAlive ?? false;
      // 导航栏显示
      this.isNavBar = !(to.meta.lv !== 1);

      if (to.params?.animate) {
        switch (to.params?.animate) {
          // 向前
          case "forward":
            this.routerAnimate =
              to.meta?.lv > from.meta?.lv
                ? `${to.params.animate}2`
                : to.params.animate;
            break;
          case "toup":
            this.routerAnimate = to.params.animate;
            break;
          // 自定义进入动画
          default:
            this.routerAnimate = to.params.animate;
            break;
        }

        // 返回
      } else {
        switch (this.routerAnimate) {
          // 上下拉
          case "toup":
            this.routerAnimate = "toDown";
            break;
          default:
            // 普通返回动画 2->1
            this.routerAnimate =
              to.meta?.lv < from.meta?.lv ? "toback2" : "toback";
            break;
        }
      }
    },
  },
};
</script>
<style>
@import url("/public/css/default.css");
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

/* 二级前进 */
.forward2-enter-active,
.forward2-leave-active {
  width: 100%;
  transition: all var(--router-delay);
  position: absolute;
  opacity: 1;
}
.forward2-leave-to {
  opacity: 0;
  filter: blur(8px) grayscale(60%);
  transform: translateX(0);
}
.forward2-enter {
  opacity: 1;
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
  transform: translateX(100%);
}
.toback-enter {
  opacity: 0;
  transform: translateX(-100%);
}
/* 二级返回 */
.toback2-enter-active,
.toback2-leave-active {
  opacity: 1;
  transition: all var(--router-delay);
  position: absolute;
  width: 100%;
}
.toback2-leave-to {
  opacity: 0.8;
  filter: blur(4px);
  transform: translateX(100%);
}
.toback2-enter {
  opacity: 0;
  transform: translateX(0%);
}

/* 上拉 */
.toup-enter-active,
.toup-leave-active {
  opacity: 1;
  transition: all calc(var(--router-delay));
  position: absolute;
  width: 100%;
}
.toup-leave-to {
  opacity: 0;
  transform: translateY(-10%) scale(0.8);
  filter: blur(10px);
  box-shadow: var(--shadow-color2);
}
.toup-enter {
  opacity: 0;
  transform: translateY(100%) scale(1);
}
/* 下拉 */
.toDown-leave-active {
  transition: all calc(var(--router-delay)) ease-in;
  position: absolute;
  transform: scale(0.8);
  width: 100%;
}
.toDown-enter-active {
  transition: all calc(var(--router-delay)) ease;
  position: absolute;
  transform: none;
  width: 100%;
}
.toDown-leave-to {
  opacity: 0;
  backdrop-filter: blur(20px);
  filter: blur(6px);
  transform: translateY(100%);
  box-shadow: var(--shadow-color2);
}
.toDown-enter {
  transform: scale(1);
}
</style>
