<template>
  <div class="sort-class" v-show="firstSortList">
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
export default {
  name: "SortClass",
  data() {
    return {
      firstSortList: [],
    };
  },
  async mounted() {
    const res = await getFirstSortList();
    this.firstSortList = res.data.data;
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
  margin-top: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
.sort-class .item {
  width: 20%;
  text-align: center;
  padding: 0.2rem;
}
.sort-class .item .img {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin: auto;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
