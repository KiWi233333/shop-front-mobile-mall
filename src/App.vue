<template>
  <div id="app">
    <transition :name="routerAnimate">
      <!-- 1)需缓存页面 -->
      <keep-alive v-if="keepAlive">
        <router-view />
      </keep-alive>
      <!-- 2)无需缓存页面 -->
      <router-view v-if="!keepAlive" />
    </transition>
    <!-- 底部导航栏 -->
    <NavBar v-if="isNavBar" />
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";
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
  },
  watch: {
    // 监控路由并添加动画
    $route(to) {
      // console.log(to.params);

      this.keepAlive = this.$route.meta?.keepAlive ?? false;
      if (to.params.animate === "forward") {
        this.routerAnimate = "forward";
      } else if (to.params.animate === "toback") {
        this.routerAnimate = "toback";
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
