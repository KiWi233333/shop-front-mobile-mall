<template>
  <van-pull-refresh v-model="isRefreshing" @refresh="reStart">
    <!-- 订单列表 -->
    <van-list
      class="orders-list"
      v-model="loading"
      :error.sync="isHttpError"
      :finished="finished"
      finished-text="没有更多商品了"
      @load="onLoad"
    >
      <div
        class="v-card order-card"
        v-for="order in orderList"
        :key="order.orderId"
      >
        <!-- 状态 -->
        <div class="flex-c-c top">
          <span class="left"
            ><van-icon name="shop" color="var(--text-color3)" />
            官方旗舰店</span
          >
          <span class="right" style="color: var(--tip-color2)">{{
            getState(order)
          }}</span>
        </div>
        <!-- 商品 -->
        <goods-info
          class="goods"
          v-for="p in order?.orderItems"
          :key="p.gid"
          :goods="p"
          :price="p.price"
          :tips="p.isPay"
          :props="getPorps(p)"
          :num="p.quantity"
        />
        <div class="all-price">
          实付：￥<span class="price">{{ getPrice(order.price) }}</span>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<script>
import {
  getAllOrder,
  getDeliveredOrder,
  getDoneOrder,
  getUnDeliverOrder,
  getUnPaidOrder,
} from "@/api/order/order";
import currency from "currency.js";
import GoodsInfo from "../Goods/GoodsInfo.vue";
export default {
  components: { GoodsInfo },
  props: {
    reqType: {
      // 请求类型
      type: String,
      required: true,
      default: "all",
    },
  },
  name: "OrderList",
  data() {
    return {
      orderList: [], // 商品列表
      isHttpError: false, // 网络请求错误
      loading: false, // 加载中
      finished: false, // 完成
      isRefreshing: false, // 刷新

      typeColor: "var(--text-color4)",
    };
  },
  methods: {
    // 加载对应的商品列表
    async onLoad() {
      if (!this.reqType) return;
      let res = null;
      this.loading = true;
      switch (this.reqType) {
        case "all":
          res = await getAllOrder(this.$store.getters.token); // 全部
          break;
        case "unpaid": // 待付款
          res = await getUnPaidOrder(this.$store.getters.token);
          break;
        case "undeliver": // 待发货
          res = await getUnDeliverOrder(this.$store.getters.token);
          break;
        case "delivered": // 待收货
          res = await getDeliveredOrder(this.$store.getters.token);
          break;
        case "comment": // 待评价
          res = await getDoneOrder(this.$store.getters.token);
          break;
      }
      console.log(res.data.data);
      if (res.status === 200 && res.data.success) {
        res.data.data.forEach((p) => {
          this.orderList.push(p);
        });
        this.loading = false;
        this.finished = true;
      } else {
        this.isHttpError = true;
      }
    },

    // 拼接属性
    getPorps(p) {
      return `${p?.color || ""} ${p?.size || ""} ${p?.edition || ""} ${
        p?.combo || ""
      }`;
    },

    // 状态文字
    getState(p) {
      let res = "";
      if (p.isPay === "未付款") {
        res = "待支付";
      } else if (p.logisticsStatus === "未发货") {
        res = "已付款，待发货";
      } else if (p.logisticsStatus === "已发货") {
        res = p.logisticsStatus;
      } else if (p.status === "未完成") {
        res = p.status;
      } else {
        res = "待评论";
      }
      return res;
    },

    getPrice(price) {
      return currency(price);
    },

    // 重新加载
    reStart() {
      this.finished = false;
      this.orderList.splice(0); // 清空数组
      new Promise((resolve) => {
        this.onLoad();
        resolve(true);
      }).then(() => {
        this.isRefreshing = false;
      });
    },
  },
};
</script>

<style scoped>
/* 商品 */
.orders-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.2rem;
  padding: 0.1rem;
  animation-delay: var(--router-delay) / 2;
}
/* 标题 */
.order-card .top {
  text-align: right;
  padding-bottom: 0.24rem;
  justify-content: space-between;
}
.order-card .top span {
  font-size: 0.36rem;
}
/* 内容 */
.orders-list .order-card {
  width: 100%;
  margin-bottom: 0.4rem;
  box-shadow: var(--shadow-color3);
  backdrop-filter: blur(20px);
  border-radius: 10px;
}
.order-card .goods {
  margin: 0.2rem 0;
}
.all-price {
  text-align: right;
}
.all-price .price {
  font-size: 0.56rem;
}

/* 列表设置 */
.orders-list >>> .van-list__loading,
.orders-list >>> .van-list__finished-text,
.orders-list >>> .van-list__error-text {
  width: 100%;
  font-size: 0.35rem;
}
</style>