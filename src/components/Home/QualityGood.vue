<template >
  <div class="goods">
    <!-- 标题 -->
    <div class="topNav">
      <div
        class="top"
        :class="active === i ? 'active' : ''"
        v-for="(p, i) in option"
        :key="i"
        @click="active = i"
      >
        <label>{{ p.title }}</label>
        <span>{{ p.fTitle }}</span>
      </div>
    </div>
    <van-tabs
      class="tabs"
      v-model="active"
      animated
      line-width="1.6rem"
      color="var(--theme-color2)"
    >
      <van-tab v-for="(p, i) in option" :key="i">
        <!-- 商品列表 -->
        <van-list
          class="good-list"
          v-model="loading"
          :error.sync="isHttpError"
          :finished="finished"
          finished-text="没有更多商品了"
          @load="onLoad"
        >
          <good-card
            :item="item"
            v-for="item in goodsList[active]"
            :key="item.id"
            class="item"
          />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getGoodsListByPageSize } from "@/api/good/good";
import GoodCard from "./GoodCard.vue";
export default {
  components: { GoodCard },
  name: "QualityGood",
  data() {
    return {
      currentPage: 1, // 当前分页
      goodsList: [[], [], [], []],

      isHttpError: false,
      loading: false,
      finished: false,
      active: 0,
      option: [
        { title: "推荐", fTitle: "为你推荐", type: 0 },
        { title: "日常", fTitle: "生活日常", type: 1 },
        { title: "新品", fTitle: "新品速达", type: 2 },
        { title: "热销", fTitle: "当季热卖", type: 3 },
      ],
    };
  },
  methods: {
    onLoad() {
      // 获取推荐商品
      this.loading = true;
      getGoodsListByPageSize(this.currentPage, 8)
        .then((res) => {
          this.loading = false;
          if (res.data.success) {
            this.finished = true;
            const data = res.data.data;
            data.records.forEach((p) => {
              this.goodsList[this.active].push(p);
            });
          } else {
            this.isHttpError = true;
          }
        })
        .catch(() => {
          this.isHttpError = true;
        });
    },
    // toDetail
  },
};
</script>
<style scoped>
.tabs {
  z-index: -1;
  margin-top: -50px;
  height: auto;
}
.topNav {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
  user-select: none;
}
.top {
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.4s;
}
.top label {
  color: var(--theme-color4);
  font-size: 0.45rem;
  text-align: center;
  transition: 0.4s;
  cursor: pointer;
  font-weight: 500;
}
.top.active {
  transform: scale(1.12);
}
.top.active label {
  font-weight: 600;
  transition: 0.4s;
}
.top.active span {
  color: var(--theme-color4);
  transition: 0.4s;
}
.top span {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.36rem;
  transition: 0.4s;
  position: relative;
}

/* 商品 */
.good-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.2rem;
  padding: 0.2rem;
}
.good-list .item {
  width: 47%;
}
.good-list >>> .van-list__loading,
.good-list >>> .van-list__finished-text,
.good-list >>> .van-list__error-text {
  width: 100%;
}
</style>