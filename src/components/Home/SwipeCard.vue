<template>
  <van-swipe
    class="v-click v-card home-swiper"
    :autoplay="5000"
    :touchable="true"
    indicator-color="#fff"
  >
    <van-swipe-item v-for="(p, i) in swiperData" :key="i">
      <img v-lazy="p.icon" />
    </van-swipe-item>
  </van-swipe>
</template>
<script>
import { getEventActives, getResourImageByName } from "@/api/res";
export default {
  name: "SwipeCard",
  data() {
    return {
      swiperData: [],
    };
  },
  async mounted() {
    const res = await getEventActives();
    if (res.data.success) {
      res.data.data.forEach((p) => {
        p.icon = getResourImageByName(p.icon);
        this.swiperData.push(p);
      });
    }
  },
};
</script>
<style scoped>
.v-card {
  height: 4.2rem;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}
.home-swiper img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  -webkit-user-drag: none;
}
</style>
