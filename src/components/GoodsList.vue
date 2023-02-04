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
    <!-- 商品卡片 -->
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
import { getEventGoodsById } from "@/api/res";
import GoodCard from "./GoodCard.vue";
export default {
  components: { GoodCard },
  props: {
    reqType: {
      // 请求类型
      type: String,
      required: false,
      default: "type",
    },
    type: {
      // 筛选配置
      type: Object,
      required: false,
    },
  },
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
      switch (this.reqType) {
        case "type": // 搜索名 or 分类
          this.reqGoodsByType();
          break;
        case "eid": // 请求分页搜索活动商品
          this.reqGoodsByEid();
          break;
      }
    },
    // 请求分页搜索商品或分类
    reqGoodsByType() {
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

    // 请求分页搜索活动商品
    reqGoodsByEid() {
      if (!this.$route.query?.eid) return;

      this.loading = true;
      // 请求活动商品
      getEventGoodsById(this.currentPage, 8, this.$route.query?.eid)
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
  font-size: 0.35rem;
}
</style>