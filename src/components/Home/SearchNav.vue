<template>
  <div class="search-nav">
    <input
      type="text"
      class="v-input search search2"
      placeholder="输入商品名称"
      v-model="keyWords"
      @change="changeSearch"
    />
    <van-icon name="search" class="icon" size="0.5rem" color="grey" />
    <input type="button" value="搜索" class="btn" />
  </div>
</template>
<script>
export default {
  name: "SearchNav",
  data() {
    return {
      keyWords: "",
    };
  },
  methods: {
    // 输入框改变事件
    changeSearch() {},
    // 搜索商品
    searchGoods() {},
  },
};
</script>
<style scoped>
.search-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.btn {
  padding: 0;
  border: none;
  background: none;
  font-size: 0.4rem;
  padding: 0 0.3rem;
}
.search {
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: auto;
  border: 1px solid var(--border-color);
  padding-left: 1rem;
}
.search2 {
  border: 1px solid var(--theme-color2);
}
.search-nav .icon {
  position: absolute;
  left: 0.4rem;
}
</style>
