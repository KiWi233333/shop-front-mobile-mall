<template >
  <div class="goods">
    <!-- 标题 -->
    <div class="topNav">
      <div
        class="nav-item"
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
      line-width="1.6rem"
      color="var(--theme-color2)"
      animated
    >
      <!-- 四种商品栏目 -->
      <van-tab v-for="(p, i) in option" :key="i">
        <goods-list :type="p.type" :active="active" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import GoodsList from "@/components/GoodsList.vue";
export default {
  components: { GoodsList },
  name: "ToggleGoods",
  data() {
    return {
      active: 0,
      option: [
        { title: "推荐", fTitle: "为你推荐", type: { recommend: 1 } },
        { title: "日常", fTitle: "生活日常", type: {} },
        { title: "新品", fTitle: "新品速达", type: { isNew: 1 } },
        { title: "热销", fTitle: "当季热卖", type: { saleSort: "Des" } },
      ],
    };
  },
};
</script>
<style scoped>
.goods {
  border-radius: 10px 10px 0 0;
  background-color: var(--theme-color);
}
.tabs {
  width: 100%;
  margin-top: -50px;
  height: auto;
}
.topNav {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
  user-select: none;
  width: 100%;
  position: relative;
  z-index: 1;
}
.nav-item {
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.4s;
}
.nav-item.active {
  transform: scale(1.06);
}
.nav-item label {
  color: var(--theme-color4);
  font-size: 0.45rem;
  text-align: center;
  transition: 0.4s;
  cursor: pointer;
  font-weight: 500;
}
.nav-item.active label {
  font-weight: 600;
  transition: 0.4s;
}
.nav-item.active span {
  color: var(--theme-color4);
  transition: 0.4s;
}
.nav-item span {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.32rem;
  transition: 0.4s;
  position: relative;
}
</style>