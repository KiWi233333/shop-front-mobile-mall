<template>
  <div class="animate__animated animate__fadeIn nav-bar">
    <div
      class="item"
      v-for="(p, i) in option"
      :key="p.path"
      @click="toPage(i)"
      :class="active === i ? 'active' : ''"
    >
      <img :src="active === i ? p.onIcon : p.icon" class="icon" />
      <span>{{ p.title }}</span>
    </div>
  </div>
</template>

<script>
import router from "@/router";
export default {
  name: "NavBar",
  data() {
    return {
      option: [
        {
          title: "首页",
          icon: require("../assets/image/icon/home.png"),
          onIcon: require("../assets/image/icon/onHome.png"),
          path: "home",
        },
        {
          title: "分类",
          icon: require("../assets/image/icon/categoty.png"),
          onIcon: require("../assets/image/icon/onCategoty.png"),
          path: "category",
        },
        {
          title: "购物车",
          icon: require("../assets/image/icon/shopcar.png"),
          onIcon: require("../assets/image/icon/onShopcar.png"),
          path: "shopcar",
        },
        {
          title: "个人中心",
          icon: require("../assets/image/icon/my.png"),
          onIcon: require("../assets/image/icon/onMy.png"),
          path: "my",
        },
      ],
      active: 0,
    };
  },
  methods: {
    // 导航切换
    toPage(i) {
      if (i !== this.active) {
        router.push({
          name: this.option[i].path,
          params: {
            animate: this.active < i ? "forward" : "toback",
          },
        });
        this.active = i;
      }
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        // 初始化地址
        for (let i = 0; i < this.option.length; i++) {
          if (to.name === this.option[i].path) {
            return (this.active = i);
          }
        }
      },
    },
  },
};
</script>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: inline-flex;
  background-color: var(--theme-color3);
  box-shadow: var(--shadow-color2);
  z-index: 999;
}
.nav-bar > .item {
  flex: 1;
  padding: 0.1rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: rgba(128, 128, 128, 0.8);
  cursor: pointer;
}
.item span {
  font-size: 0.32rem;
}
.item.active {
  color: black;
  color: var(--theme-color4);
  font-weight: 600;
}
.item .icon {
  width: 0.6rem;
  transition: 0.5s;
  display: block;
  margin: 0.2rem 0;
}
.item.active .icon {
  animation: swing;
  animation-duration: 1s;
}
</style>
