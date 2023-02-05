<template>
  <div class="wind-init home">
    <div class="bg"></div>
    <!-- 搜索栏 -->
    <div class="search-nav" @click="toSearchView">
      <input type="text" class="v-input search" placeholder="搜索" disabled />
      <van-icon name="search" class="icon" size="0.5rem" color="grey" />
    </div>
    <!-- 轮播图广告 -->
    <swipe-card />
    <!-- 分类栏目 -->
    <sort-class />
    <!-- 商品栏目 -->
    <toggle-goods />
  </div>
</template>

<script>
import SwipeCard from "@/components/Home/SwipeCard.vue";
import SortClass from "@/components/Home/SortClass.vue";
import ToggleGoods from "@/components/Home/ToggleGoods.vue";
import router from "@/router";
import { getNoticeByPage } from "@/api/system/notice";
export default {
  name: "HomeView",
  components: { SwipeCard, SortClass, ToggleGoods },
  methods: {
    // 导航到搜索页面
    toSearchView() {
      router.push({
        name: "search",
        params: {
          animate: "forward",
        },
      });
    },
  },
  created() {
    getNoticeByPage(1, 8).then((res) => {
      // console.log(res.data);
      res.data.dta;
    });
  },
};
</script>


<style scoped>
.home {
  display: flex;
  flex-direction: column;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 0;
  height: 4.5rem;
  background-image: linear-gradient(
    var(--theme-color2) 40%,
    var(--theme-color)
  );
}
/* 搜索 */
.search-nav {
  justify-content: center;
  align-items: center;
  position: relative;
}
.search-nav .search {
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: auto;
  border: 1px solid var(--border-color);
  padding-left: 1rem;
}

.search-nav .icon {
  position: absolute;
  top: 0.25rem;
  left: 0.4rem;
}
</style>
