<template>
  <div class="v-card good-card" @click="toGoodsDetail(item.goods.id)">
    <img :src="getImgSrc(item.goods.images)" class="bg" />
    <div class="bottom">
      <div class="title">{{ item.goods.name }}</div>
      <div class="price">
        ￥<span class="tip">{{ item.price }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import router from "@/router";
export default {
  props: ["item"],
  name: "SortClass",
  data() {
    return {};
  },
  methods: {
    // 点击跳转对应的商品详情页面
    toGoodsDetail(id) {
      console.log(1);
      router.push({
        name: "goodsDetail",
        params: { id },
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
.good-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 12px;
  margin: 0.25rem 0;
}
.bg {
  display: block;
  width: 100%;
  height: 4.5rem;
  object-fit: cover;
}

.bottom {
  padding: 0.2rem 0.3rem;
}
.bottom .title {
  font-size: 0.45rem;
}
.price {
  font-size: 0.3rem;
}
</style>
