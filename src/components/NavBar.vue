<template>
  <div class="nav-bar">
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
  mounted() {
    // 初始化地址
    for (let i = 0; i < this.option.length; i++) {
      if (this.$route.name === this.option[i].path) {
        return (this.active = i);
      }
    }
  },
  methods: {
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
};
</script>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: inline-flex;
}
.nav-bar > .item {
  flex: 1;
  padding: 0.3rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.4rem;
  font-weight: 600;
  color: rgba(128, 128, 128, 0.8);
  cursor: pointer;
}
.item.active {
  color: black;
  color: var(--theme-color4);
  font-weight: 600;
}
.item .icon {
  width: 0.7rem;
  transition: 0.5s;
  display: block;
  margin: 0.1rem;
}
.item.active .icon {
  animation: swing;
  animation-duration: 1s;
}
</style>
