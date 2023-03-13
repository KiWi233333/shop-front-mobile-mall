<template>
  <div class="v-card good-card">
    <!-- 商品图片 -->
    <van-image
      class="bg"
      lazy-load
      :src="getImgSrc"
      @click="toGoodsDetail(goods.gid)"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="24" />
      </template>
    </van-image>
    <!-- 介绍 -->
    <div class="content" @click="toGoodsDetail(goods.gid)">
      <div class="title">{{ goods.name }}</div>
      <div class="price">
        ￥<span class="tip">{{ getPrice }}</span>
      </div>
      <div class="sales">热销中</div>
    </div>
    <div class="lf-tip">
      <van-icon
        @click="updataIsCollect(index, goods.gid)"
        name="star"
        class="icon"
        size="0.5rem"
        color="var(--tip-color2)"
      />
      <van-icon name="cart-o" class="icon" size="0.45rem" color="var(--)" />
    </div>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import { deleteCollectByGid } from "@/api/user/collect";
import { Dialog, Toast } from "vant";
import currency from "currency.js";
export default {
  props: ["goods", "index"],
  name: "SortClass",
  methods: {
    // 点击跳转对应的商品详情页面
    toGoodsDetail(id) {
      this.$router.push({
        name: "detail",
        query: { id },
        params: { animate: "forward" },
      });
    },
    // 取消收藏
    updataIsCollect(index, gid) {
      Dialog.confirm({ title: "是否取消收藏？" })
        .then(() => {
          deleteCollectByGid(gid, this.$store.getters.token)
            .then((res) => {
              if (res.data.code === 20011) {
                this.$emit("deleteCollect", index);
                Toast(" 取消成功！");
              } else {
                Toast(" 取消失败！");
              }
            })
            .catch(() => {
              Toast(" 取消失败！");
            });
        })
        .catch(() => {});
    },
  },
  computed: {
    getImgSrc() {
      return getResourImageByName(this.goods.images);
    },
    getPrice() {
      return currency(this.goods.price);
    },
  },
};
</script>
<style scoped>
.good-card {
  display: flex;
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  margin: 0.2rem 0;
  backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.8);
}
.bg {
  display: block;
  width: 3.4rem;
  height: 3.4rem;
  object-fit: contain;
  padding: 0.3rem;
}
.bg >>> .van-image__img {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-color3);
  border: 0.05 solid var(--border-color);
}
/* 详情 */
.content {
  height: 100%;
  padding: 0.4rem 0.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content .title {
  font-size: 0.4rem;
}

.price {
  font-size: 0.4rem;
  padding-top: 0.1rem;
  color: var(--tip-color2);
}
.price .tip {
  font-size: 0.7rem;
}
.sales {
  font-size: 0.3rem;
  opacity: 0.7;
}
.lf-tip {
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lf-tip .icon {
  padding: 0 0.12rem;
}
.lf-tip .text {
  font-size: 0.3rem;
  color: var(--tip-color);
}
</style>
