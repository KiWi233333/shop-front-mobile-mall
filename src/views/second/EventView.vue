<template>
  <div
    class="event-view"
    :style="themeColor.color ? `background-color:${themeColor.color};` : ''"
  >
    <!-- 顶部导航 -->
    <share-nav class="top" />
    <!-- 背景 -->
    <div
      class="top animate__animated animate__fadeIn"
      v-show="themeColor.color"
    >
      <van-image
        :src="getImgSrc(active?.icon)"
        fit="cover"
        width="100%"
        height="5rem"
        radius="8px"
      />
      <div
        class="shade"
        :style="
          themeColor.color
            ? `background-image:linear-gradient(rgba(255, 255, 255, 0),${themeColor.color} 60%);`
            : ''
        "
      ></div>
    </div>
    <!-- 内容 -->
    <div class="content animate__animated delay animate__fadeIn">
      <goods-list :req-type="'eid'" />
    </div>
  </div>
</template>

<script>
import analyze from "rgbaster"; // 色调分析器
import GoodsList from "@/components/GoodsList.vue";
import ShareNav from "@/components/Detail/ShareNav.vue";
import { getEventActives, getResourImageByName } from "@/api/res";
export default {
  components: { GoodsList, ShareNav },
  name: "EventView",
  data() {
    return {
      active: {},
      themeColor: {}, // 主色调
    };
  },
  created() {
    // 请求活动
    (async () => {
      const res = await getEventActives();
      if (res.data.code === 20011) {
        res.data.data.forEach((p) => {
          if (p.id == this.$route.query?.eid) {
            this.active = p;
            // 浏览器标题设置
            document.title = p.name || this.$route.meta?.title;
          }
        });
      }
      return res.data.code === 20011;
    })().then(() => {
      const url = this.getImgSrc(this.active?.icon);
      analyze(url, { scale: 0.1 })
        .then((res) => {
          this.themeColor = res[0];
        })
        .catch(() => {});
    });
  },
  methods: {
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
};
</script>

<style scoped>
.top >>> .top-nav {
  background-image: none;
  border: none;
}
.event-view {
  width: 100%;
  min-height: 100vh;
}

.top {
  position: relative;
}
.shade {
  position: absolute;
  bottom: -1rem;
  width: 100%;
  height: 2rem;
  z-index: 1;
}
.animate__animated.delay {
  animation-delay: calc(var(--router-delay) * 2);
}
.content {
  padding: 0.2rem 0.3rem;
}
.content >>> .van-list__finished-text {
  opacity: 0.7;
  font-size: 0.4rem;
}
</style>