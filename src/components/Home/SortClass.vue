<template>
  <div class="v-card sort-class" v-show="firstSortList">
    <div
      class="v-click item"
      v-for="(p, i) in firstSortList"
      :key="p.id"
      v-show="i < 9"
      @click="toCategoryView(i)"
    >
      <img :src="getImgSrc(p.icon)" class="img" />
      <span>{{ p.name }}</span>
    </div>
    <div class="item" @click="toCategoryView(0)">
      <van-icon name="qr" class="img" size="0.8rem" />
      <span>更多</span>
    </div>
  </div>
</template>
<script>
import { getFirstSortList } from "@/api/good/good";
import { getResourImageByName } from "@/api/res";
import { asyncCacheData } from "@/util/cache";
export default {
  name: "SortClass",
  data() {
    return {
      firstSortList: [],
    };
  },
  created() {
    // 设置前置缓存
    asyncCacheData(
      this.firstSortList,
      getFirstSortList,
      {},
      "firstSortList"
    ).then((list) => {
      this.firstSortList = list;
    });
  },
  methods: {
    // 跳转到分类页面
    toCategoryView(id) {
      this.$router.push({
        name: "category",
        params: {
          animate: "forward",
        },
        query: { id },
      });
    },
    // 获取图片地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
};
</script>
<style scoped>
.sort-class {
  /* box-shadow: var(--shadow-color3); */
  box-shadow: none;
  margin-top: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  backdrop-filter: saturate(50%) blur(10px);
  position: relative;
  backdrop-filter: blur(20px);
  border-radius: 10px;
  padding: 0.3rem 0;

  /* background-image: radial-gradient(
    var(--bg-color5) 1px,
    var(--theme-color) 1px
  );
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(10px); */
}
.sort-class::before,
.sort-class::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  filter: blur(20px);
  z-index: -1;
  background: linear-gradient(160deg, #fdb513, rgba(255, 255, 255, 0.288) 23%);
}

.sort-class::after {
  background: linear-gradient(
    -50deg,
    #ff2b4fad,
    rgba(255, 255, 255, 0.288) 20%
  );
}
.sort-class .item {
  width: 20%;
  text-align: center;
  padding: 0 0.12rem;
  margin-bottom: 0.1rem;
}
.sort-class .item .img {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  margin: auto;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
