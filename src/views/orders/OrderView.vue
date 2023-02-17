<template>
  <default-page title="我的订单">
    <div class="nav-bar"></div>
    <van-tabs
      sticky
      class="tabs"
      v-model="active"
      swipeable
      animated
      line-width="1.2rem"
      color="var(--theme-color2)"
      title-active-color="var(--theme-color2)"
    >
      <!-- 筛选条件 -->
      <van-tab v-for="(p, i) in option" :key="i" :title="p.title">
        <!-- 商品列表 -->
        <order-list :reqType="p.type" />
      </van-tab>
    </van-tabs>
  </default-page>
</template>
<script>
import DefaultPage from "@/components/DefaultPage.vue";
import OrderList from "@/components/Order/OrderList.vue";
export default {
  components: { DefaultPage, OrderList },
  name: "OrderView",
  props: { index: { required: false, default: 0 } },
  data() {
    return {
      active: 0,
      option: [
        { title: "全部", type: "all" },
        { title: "待付款", type: "unpaid" },
        { title: "待发货", type: "undeliver" },
        { title: "待收货", type: "delivered" },
        { title: "评价", type: "comment" },
      ],
    };
  },
  mounted() {
    // 切换栏目
    if (this.index !== undefined) {
      this.active = this.index;
    }
  },
};
</script>
<style scoped>
.tabs {
  width: 100%;
  height: auto;
  margin-top: -10px;
}
</style>