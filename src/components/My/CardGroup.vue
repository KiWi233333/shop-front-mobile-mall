<template>
  <van-swipe
    loop
    autoplay="8000"
    stop-propagation
    indicator-color="transparent"
    class="animate__animated animate__fadeInLeft card-group"
  >
    <van-swipe-item class="v-card CardGroup" v-for="(p, i) in option" :key="i">
      <div class="v-click left-card" @click="toView(p[0].target)">
        <div class="left">
          <span>{{ p[0].title }}</span>
          <span>{{ p[0].name }}</span>
        </div>
        <img :src="p[0].icon" class="bg" />
      </div>
      <span style="border: 1px solid var(--bg-color3); height: 1.8rem"></span>
      <div class="v-click right-card" @click="toView(p[1].target)">
        <div class="left">
          <span>{{ p[1].title }}</span>
          <span>{{ p[1].name }}</span>
        </div>
        <img :src="p[1].icon" class="bg" />
      </div>
    </van-swipe-item>
  </van-swipe>
</template>
<script>
export default {
  name: "CardGroup",
  data() {
    return {
      option: [
        [
          {
            title: "我的订单",
            name: "查看最近商品",
            icon: require("@/assets/image/bg/order_bg.png"),
            target: "order",
          },
          {
            title: "收藏商品",
            name: "收藏你所喜欢",
            icon: require("@/assets/image/bg/collect_bg.png"),
            target: "collect",
          },
        ],
        [
          {
            title: "账单",
            name: "记录你的账单",
            icon: require("@/assets/gif/cars.gif"),
            target: "bills",
          },
          {
            title: "地址管理",
            name: "查看最近地址",
            icon: require("@/assets/image/icon/onCategoty.png"),
            target: "address",
          },
        ],
      ],
    };
  },
  methods: {
    // 二级页面跳转
    toView(target) {
      this.$router.push({
        name: this.$store.getters.token !== "" ? target : "login",
        params: {
          animate: "forward",
          toBack: true,
        },
      });
    },
  },
};
</script>
<style scoped>
.CardGroup {
  animation-delay: calc(var(--router-delay) / 1.5);
  display: flex;
  align-items: center;
  margin: 0.3rem 0rem;
  width: 100%;
}
.left-card,
.right-card {
  display: flex;
  width: 50%;
  justify-content: space-around;
  align-items: center;
  padding: 0.4rem 0.2rem;
  cursor: pointer;
}
.left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left span:nth-child(2) {
  font-size: 0.3rem;
  opacity: 0.6;
}
.CardGroup img {
  display: block;
  height: 1.1rem;
  width: 1.1rem;
  padding: 0.1rem;
  object-fit: cover;
}
.CardGroup img:nth-child(3) {
  height: 2.2rem;
  width: 2.2rem;
}
</style>