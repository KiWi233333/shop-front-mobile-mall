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
      <transition-group name="sliceInZoomOut" tag="div">
        <div
          :key="order?.orderId"
          class="v-card order-card"
          v-for="(order, i) in orderList"
        >
          <!-- 状态 -->
          <div class="flex-c-c top" v-if="order?.orderItems?.length">
            <span class="left"
              ><van-icon name="shop" color="var(--text-color3)" />
              官方旗舰店</span
            >
            <span class="right" style="color: var(--tip-color2)">{{
              getState(order)
            }}</span>
          </div>
          <!-- 商品 -->
          <div
            class="good-list"
            v-if="order?.orderItems"
            @click="toView('', order)"
          >
            <goods-info
              class="goods"
              v-for="p in order.orderItems"
              :key="p?.gid"
              :goods="p"
              :price="p?.price"
              :tips="p?.isPay"
              :props="getPorps(p)"
              :num="p.quantity"
            />
          </div>
          <!-- 总计 -->
          <div class="all-price" v-if="order?.orderItems?.length">
            <small>( 共{{ order?.orderItems.length }}件 )</small>
            实付：￥<span class="price">{{ getPrice(order.price) }}</span>
          </div>
          <!-- 按钮 -->
          <!-- 待支付 -->
          <div class="btns" v-if="getState(order) == '待支付'">
            <button
              class="v-click btn cancel"
              @click="cancelOrder(order?.orderId, i)"
            >
              取消订单
            </button>
            <button
              class="v-click btn cancel"
              @click="toView('update', order, i)"
            >
              修改
            </button>
            <button class="v-click btn" @click="toView('unpaid', order, i)">
              去支付
            </button>
          </div>
          <!-- 未发货 -->
          <div class="btns" v-if="getState(order) === '已付款，待发货'">
            <button class="v-click btn cancel" @click="toastDeliver">
              催发货
            </button>
          </div>
          <!-- 已发货 -->
          <div class="btns" v-if="getState(order) === '已发货，待收货'">
            <button
              class="v-click btn"
              @click="checkDeliverd(order?.orderId, i)"
            >
              确认收货
            </button>
          </div>
          <!-- 去评论 -->
          <div class="btns" v-if="getState(order) === '已签收，待评价'">
            <button class="v-click btn" @click="toAddComment(order?.orderId)">
              去评论
            </button>
          </div>
          <!-- 已经评论 -->
          <!-- <div class="btns" v-if="getState(order) === '已评价'">已完成</div> -->
        </div>
      </transition-group>
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
  cancelOrderById,
  doneOrder,
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
      comment: "", // 取消订单理由
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
      // console.log(res.data);
      if (res.status === 200 && res.data.code === 20011) {
        let count = 0;
        const data = res?.data?.data;
        // 判断是否为空
        if (data.length === 0) {
          this.finished = true;
          this.loading = false;
          return;
        }
        let timer = setInterval(() => {
          data[count].reqType = this.reqType === "all" ? "" : this.reqType;
          this.orderList.push(data[count]);
          count++;
          if (count >= data.length) {
            this.loading = false;
            this.finished = true;
            clearInterval(timer);
            timer = "";
          }
        }, 300);
      } else {
        this.isHttpError = true;
        this.finished = true;
        this.loading = false;
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
      if (!p?.isPay) return;
      let res = "";
      if (p.isPay === "未付款") {
        res = "待支付";
      } else if (p.logisticsStatus === "未发货") {
        res = "已付款，待发货";
      } else if (p.logisticsStatus === "待收货" && p.status === "未完成") {
        res = "已发货，待收货";
      } else if (p.logisticsStatus === "已收货" && p.status === "已完成") {
        res = "已签收，待评价";
      } else {
        res = "已评价";
      }
      return res;
    },
    // 状态En
    getStateEn(p) {
      if (!p?.isPay) return;
      let res = "";
      if (p.isPay === "未付款") {
        res = "unpaid";
      } else if (p.logisticsStatus === "未发货") {
        res = "undeliver";
      } else if (p.logisticsStatus === "待收货" && p.status === "未完成") {
        res = "delivered";
      } else if (p.logisticsStatus === "已收货" && p.status === "已完成") {
        res = "uncomment";
      } else {
        res = "comment";
      }
      return res;
    },

    // 获得总价
    getPrice(price) {
      return currency(price);
    },

    // 重新加载
    reStart() {
      this.finished = false;
      this.orderList.splice(0); // 清空数组
      new Promise((resolve) => {
        if (this.isRefreshing) this.onLoad();
        resolve(true);
      }).then(() => {
        setTimeout(() => {
          this.isRefreshing = false;
        }, 1600);
      });
    },

    // 1）待支付
    //  取消订单
    async cancelOrder(id, i) {
      if (id === "") return;
      this.$dialog
        .confirm({
          title: "是否取消订单？",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await cancelOrderById(
                id,
                this.comment,
                this.$store.getters.token
              );
              if (res.status === 200 && res.data.code === 20011) {
                this.$toast({
                  message: "取消成功！",
                  duration: 500,
                  type: "success",
                });
                this.orderList.splice(i, 1);
              } else {
                this.$toast("取消失败，稍后再试！");
              }
              done();
            }
            done();
          },
        })
        .catch(() => {});
    },

    // 2）已付款
    // 催发货
    toastDeliver() {
      this.$dialog({ title: "已经催促商家，请耐心等候！" });
    },

    // 3）已发货、待收货
    checkDeliverd(id, i) {
      if (id === "") return;
      this.$dialog
        .confirm({
          title: "是否收到货品？",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await doneOrder(id, this.$store.getters.token);
              if (res.status === 200 && res.data.code === 20011) {
                done();
                this.$toast({
                  message: "收货成功！",
                  duration: 500,
                  type: "success",
                });
                this.orderList.splice(i, 1);
              } else {
                this.$toast("确认失败，请重新提交！");
              }
            } else {
              done();
            }
          },
        })
        .catch(() => {});
    },

    // 去到详情页type, order, index
    toView(orderType, order) {
      if (orderType === "") {
        orderType = this.getStateEn(order);
      }
      // console.log(orderType);
      this.$router.push({
        name: "checkorder",
        params: {
          animate: "forward",
        },
        query: {
          info: order,
          goodsList: order?.orderItems,
          isOrder: true,
          orderType,
        },
      });
    },

    // 4）确认收货
    async sureOrder(id, i) {
      if (id === "") return;
      this.$dialog
        .confirm({
          title: "是否收到商品？",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await doneOrder(id, this.$store.getters.token);
              if (res.status === 200 && res.data.code === 20011) {
                done();
                this.$toast({
                  message: "收货成功~",
                  duration: 500,
                  type: "success",
                });
                this.orderList.splice(i, 1);
              } else {
                this.$toast("收货失败，请重新提交！");
              }
            } else {
              done();
            }
          },
        })
        .catch(() => {});
    },

    // 5）去添加评论页面
    toAddComment(id) {
      this.$router.push({
        name: "addcomment",
        params: {
          animate: "forward",
        },
        query: {
          id,
        },
      });
    },

    // 6）查看评论页面
    toOrderComment(id) {
      console.log(id);
      this.$router.push({
        name: "commentdetail",
        params: {
          animate: "forward",
        },
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
/* 商品 */
.orders-list {
  margin-top: 0.2rem;
  padding: 0.1rem;
  transition: all 0.4s;
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
  /* border-top: 1px solid #eeeeee8b;
  border-bottom: 1px solid #eeeeee8b; */
  padding: 0.2rem;
  text-align: right;
}
.all-price .price {
  font-size: 0.56rem;
}
/* 按钮 */
.btns {
  margin-top: 0.2rem;
  display: flex;
  justify-content: right;
}
.btns .btn {
  background-color: var(--tip-color2);
  box-shadow: none;
  border-radius: 4px;
  color: var(--text-color2);
  padding: 0.1rem 0.2rem;
  transition: 0.2s;
  font-size: 0.3rem;
  margin-left: 0.2rem;
}
.btns .cancel {
  border-radius: 4px;
  background-color: var(--theme-color3);
  color: var(--text-colo4);
  border: 1px solid var(--text-color3);
}
.btns .btn:hover,
.btns .btn:active {
  filter: brightness(0.9);
}

/* 列表设置 */
.orders-list >>> .van-list__loading,
.orders-list >>> .van-list__finished-text,
.orders-list >>> .van-list__error-text {
  width: 100%;
  font-size: 0.35rem;
}
</style>