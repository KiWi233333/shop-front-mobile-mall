<template>
  <div class="event-view animate__animated animate__fadeIn">
    <!-- 顶部导航 -->
    <share-nav />
    <!-- 背景 -->
    <div class="top animate__animated animate__headShake" v-show="active?.name">
      <van-image
        lazy-load
        :src="getImgSrc(active?.icon)"
        fit="cover"
        width="100%"
        height="5rem"
      />
      <label class="title">{{ active?.name ?? "暂无活动信息" }}</label>
    </div>
    <!-- 内容 -->
    <div class="content">
      <goods-list :req-type="'eid'" />
    </div>
  </div>
</template>

<script>
import GoodsList from "@/components/GoodsList.vue";
import ShareNav from "@/components/Detail/ShareNav.vue";
import { getEventActives, getResourImageByName } from "@/api/res";
export default {
  components: { GoodsList, ShareNav },
  name: "EventView",
  data() {
    return {
      active: {},
    };
  },
  created() {
    // 请求活动
    (async () => {
      const res = await getEventActives();
      if (res.data.success) {
        res.data.data.forEach((p) => {
          if (p.id == this.$route.query?.eid) {
            this.active = p;
          }
        });
      }
    })();
  },
  methods: {
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
};
</script>

<style scoped>
.event-view {
  width: 100%;
  min-height: 100vh;
}
.top .title {
  font-size: 0.5rem;
  text-align: center;
  width: 100%;
}
.animate__animated {
  animation-delay: calc(var(--router-delay));
}
</style>