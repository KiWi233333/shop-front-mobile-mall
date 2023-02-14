<template >
  <div class="goods-info">
    <img :src="getImgSrc" class="left img" />
    <div class="center">
      <div class="title">{{ goods.name }}</div>
      <div class="props">{{ props }}</div>
    </div>
    <div class="right">
      <div class="title">
        ￥<span class="price">{{ price }}</span>
      </div>
      <div class="num">x{{ num }}</div>
    </div>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
export default {
  name: "GoodsInfo",
  props: ["goods", "price", "props", "num"],
  methods: {},
  computed: {
    getImgSrc() {
      return getResourImageByName(this.goods?.images);
    },
  },
};
</script>
<style scoped>
.goods-info {
  display: flex;
  justify-content: space-between;
}
.left.img {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 10px;
  display: block;
  object-fit: cover;
  border: 1px solid var(--border-color);
}
.center {
  flex: 2;
  width: 4.6rem;
  padding: 0 0.3rem;
}
.center .title {
  font-weight: 600;
  padding: 0.05rem 0;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.center .props {
  padding: 0.05rem 0;
  font-size: 0.36rem;
  color: var(--text-color3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right .title {
  font-size: 0.32rem;
  padding: 0.05rem 0;
}
.right .price {
  font-weight: 600;
  font-size: 0.45rem;
}
.right .num {
  text-align: right;
  color: var(--text-color3);
  font-size: 0.3rem;
}
</style>