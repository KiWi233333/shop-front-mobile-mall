<template>
  <div class="wind-init home">
    <div class="bg"></div>
    <!-- 搜索栏 -->
    <search-nav :isRouter="true" />
    <!-- 轮播图广告 -->
    <swipe-card />
    <!-- 分类栏目 -->
    <sort-class />
  </div>
</template>

<script>
import SearchNav from "@/components/Home/SearchNav.vue";
import SwipeCard from "@/components/Home/SwipeCard.vue";
import SortClass from "@/components/Home/SortClass.vue";
export default {
  name: "HomeView",
  components: { SearchNav, SwipeCard, SortClass },
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
</style>
