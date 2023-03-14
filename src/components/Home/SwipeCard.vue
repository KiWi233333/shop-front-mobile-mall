<template>
  <van-swipe
    class="v-click v-card home-swiper"
    :autoplay="6000"
    :touchable="true"
    indicator-color="#fff"
  >
    <van-swipe-item
      @click="toEventView(p)"
      v-for="(p, i) in eventData"
      :key="i"
    >
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
      eventData: [],
    };
  },
  mounted() {
    // 请求活动
    (async () => {
      const res = await getEventActives();
      if (res.data.code === 20011) {
        res.data.data.forEach((p) => {
          p.icon = getResourImageByName(p.icon);
          this.eventData.push(p);
        });
      }
    })();
  },
  methods: {
    toEventView(p) {
      // 跳转
      this.$router.push({
        name: "active",
        params: { animate: "forward" },
        query: {
          eid: p.id,
          event: p,
        },
      });
    },
  },
};
</script>
<style scoped>
.v-card {
  height: 4.5rem;
  padding: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  box-shadow: var(--shadow-color3);
  border-radius: 10px;
}
.home-swiper img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  -webkit-user-drag: none;
}
</style>
