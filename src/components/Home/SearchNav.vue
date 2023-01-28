<template>
  <div class="search-nav" @click="toSearchView">
    <input
      type="text"
      class="v-input search"
      placeholder="搜索"
      v-model="key"
      @focus="searchGoods"
      @change="changeSearch"
    />
    <van-icon name="search" class="icon" />
    <input type="button" v-if="!isRouter" value="搜索" class="v-btn" />
  </div>
</template>
<script>
import router from "@/router";
export default {
  name: "SearchNav",
  props: ["isRouter"],
  data() {
    return {
      key: "",
    };
  },
  methods: {
    // 搜索商品
    searchGoods() {},

    // 输入框改变事件
    changeSearch() {},

    // 导航到搜索页面
    toSearchView() {
      if (this?.isRouter) {
        router.push({
          name: "search",
          params: {
            animate: "forward",
          },
        });
      }
    },
  },
};
</script>
<style scoped>
.search-nav {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search {
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: auto;
  border: 1px solid var(--border-color);
  padding-left: 1rem;
  position: relative;
}

.search-nav .icon {
  position: absolute;
  left: 0.8rem;
}
</style>
