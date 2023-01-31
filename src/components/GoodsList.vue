<template>
  <!-- 商品列表 -->
  <van-list
    class="animate__animated animate__fadeIn good-list"
    v-model="loading"
    :error.sync="isHttpError"
    :finished="finished"
    finished-text="没有更多商品了"
    @load="onLoad"
  >
    <good-card
      :item="item"
      v-for="item in goodsList"
      :key="item.id"
      class="item"
    />
  </van-list>
</template>
<script>
import { getGoodsListByPageSize } from "@/api/good/good";
import GoodCard from "./GoodCard.vue";
export default {
  components: { GoodCard },
  props: ["type"],
  name: "GoodsList",
  data() {
    return {
      currentPage: 1, // 当前分页
      goodsList: [], // 商品列表
      isHttpError: false, // 网络请求错误
      loading: false, // 加载中
      finished: false, // 完成
    };
  },
  methods: {
    // 加载对应的商品列表
    onLoad() {
      if (this.type === undefined) return;
      this.loading = true;
      getGoodsListByPageSize(this.currentPage, 8, { ...this.type })
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            data.records.forEach((p) => {
              this.goodsList.push(p);
            });

            // 加载状态结束
            this.loading = false; // 下一页

            // 数据全部加载完成
            if (this.goodsList.length === data.total) {
              // console.log(this.currentPage, data.pages);// 数据页数
              this.finished = true;
            } else {
              this.currentPage = data.current;
              this.currentPage++;
            }
          } else {
            this.isHttpError = true;
          }
        })
        .catch(() => {
          this.isHttpError = true;
        });
    },

    // 重新加载
    reStart() {
      new Promise((res) => {
        this.currentPage = 1;
        this.goodsList.splice(0); // 清空数组
        return res(true);
      }).then(() => {
        this.onLoad();
      });
    },
  },
  watch: {
    type(newVal, oldVal) {
      // 销量升降序
      if (newVal.saleSort !== oldVal.saleSort) {
        this.reStart();
      }
      // 价格升降序
      if (newVal.priceSort !== oldVal.priceSort) {
        this.reStart();
      }
    },
  },
};
</script>

<style scoped>
/* 商品 */
.good-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.2rem;
  padding: 0.1rem;
  animation-delay: var(--router-delay) / 2;
}
.good-list .item {
  width: 48%;
}
.good-list >>> .van-list__loading,
.good-list >>> .van-list__finished-text,
.good-list >>> .van-list__error-text {
  width: 100%;
}
</style>