<template>
  <div class="wind-init goods-detail">
    <div class="bg"></div>
    <!-- 搜索栏 -->
    <search-nav :isRouter="true" />
    <!-- 轮播图广告 -->
    <swipe-card />
    <!-- 分类栏目 -->
    <sort-class />
    <!-- 精品推荐 -->
    <quality-good />
  </div>
</template>

<script>
export default {
  name: "GoodsDetail",
  components: {},
};
</script>


<style scoped>
.goods-detail {
  display: flex;
  flex-direction: column;
}
</style>
