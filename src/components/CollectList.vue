<template>
  <!-- 商品列表 -->
  <van-list
    class="animate__animated animate__fadeIn good-list"
    v-model="loading"
    :error.sync="isHttpError"
    :finished="finished"
    finished-text="没有收藏的商品了"
    @load="onLoad"
  >
    <transition-group name="bottomRight" tag="div" class="item">
      <!-- 商品卡片 -->
      <good-rowcard
        :goods="goods"
        v-for="(goods, i) in collectList"
        :key="goods.gid"
        :index="i"
        class="item"
        @deleteCollect="deleteCollect"
      />
    </transition-group>
  </van-list>
</template>
  <script>
import { getAllCollectByGid } from "@/api/user/collect";
import GoodRowcard from "@/components/GoodRowcard.vue";
export default {
  components: { GoodRowcard },
  name: "CollectList",
  data() {
    return {
      collectList: [], // 收藏列表
      isHttpError: false, // 网络请求错误
      loading: false, // 加载中
      finished: false, // 完成
    };
  },
  methods: {
    // 加载对应的商品列表
    onLoad() {
      this.loading = true;
      // 收藏
      getAllCollectByGid(this.$store.getters.token)
        .then((res) => {
          // console.log(res.data);
          if (res.data.code === 20011) {
            const data = res.data.data;
            data.forEach((p) => {
              this.collectList.push(p);
            });

            // 加载状态结束
            this.loading = false; // 下一页

            // 数据全部加载完成
            if (this.collectList.length === data.length) {
              this.finished = true;
            }
          } else {
            this.isHttpError = true;
          }
        })
        .catch(() => {
          this.isHttpError = true;
        });
    },

    // 删除
    deleteCollect(index) {
      this.collectList.splice(index, 1);
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
  width: 100%;
}
.good-list >>> .van-list__loading,
.good-list >>> .van-list__finished-text,
.good-list >>> .van-list__error-text {
  width: 100%;
  font-size: 0.35rem;
}
</style>