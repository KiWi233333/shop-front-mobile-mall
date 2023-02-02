<template>
  <div class="v-card good-card" @click="toGoodsDetail(item.goods.id)">
    <!-- 商品图片 -->
    <van-image class="bg" lazy-load :src="getImgSrc(item.goods.images)">
      <template v-slot:loading>
        <van-loading type="spinner" size="24" />
      </template>
    </van-image>
    <!-- 介绍 -->
    <div class="bottom">
      <div class="title">{{ item.goods.name }}</div>
      <div class="price">
        ￥<span class="tip">{{ item.price }}</span>
      </div>
      <div class="sales">销量 {{ item.goods.sale }}</div>
      <van-icon
        name="shopping-cart-o"
        class="lf-tip"
        size="0.4rem"
        color="var(--text-color)"
      />
    </div>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
export default {
  props: ["item"],
  name: "SortClass",
  data() {
    return {};
  },
  methods: {
    // 点击跳转对应的商品详情页面
    toGoodsDetail(id) {
      this.$router.push({
        name: "detail",
        query: { id },
        params: { animate: "forward" },
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
  border-radius: 10px;
  margin: 0.2rem 0;
}
.bg {
  display: block;
  width: 100%;
  height: 4rem;
  object-fit: cover;
}
/* 详情 */
.bottom {
  padding: 0.2rem 0.25rem;
}
.bottom .title {
  font-size: 0.4rem;
}

.price {
  font-size: 0.4rem;
  padding-top: 0.1rem;
  color: var(--tip-color);
}
.price .tip {
  font-size: 0.55rem;
}
.sales {
  font-size: 0.3rem;
  opacity: 0.7;
}
.bottom .lf-tip {
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  border: none;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
