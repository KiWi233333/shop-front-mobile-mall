<template >
  <div class="contian">
    <div class="shop-view" v-if="$store.state.isLoginState">
      <!-- 顶部 -->
      <div class="top">
        <span class="title">
          <span class="big">购物车</span>
          <small> ({{ counts }}件商品)</small>
        </span>
        <span
          class="edit"
          style="
            margin-left: auto;
            padding-right: 0.2rem;
            color: var(--text-color3);
          "
          @click="deleteAllCart"
        >
          清空
        </span>
        <span
          class="edit"
          :style="isEdit ? 'color:var(--tip-color2)' : ''"
          @click="isEdit = !isEdit"
          >{{ isEdit ? "退出管理" : "管理" }}</span
        >
      </div>
      <!-- 列表 -->
      <cart-list
        :selectAll="selectAll"
        :isEdit="isEdit"
        @changeSelectArr="changeSelectArr"
        @getCartLength="getCartLength"
      />

      <!-- 1）批量结算 -->
      <van-submit-bar
        v-show="!isEdit"
        class="bar submits"
        :price="getFinallPrices"
        button-text="结算"
        @submit="onSubmitOrder"
      >
        <van-checkbox v-model="selectAll" checked-color="var(--tip-color2)"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <!-- 2）批量删除 -->
      <van-submit-bar
        v-show="isEdit"
        class="bar deletes"
        button-text="删除"
        button-color="var(--tip-color2)"
        @submit="deleteShopCart"
      >
        <van-checkbox
          v-model="selectAll"
          checked-color="var(--tip-color2)"
          style="margin-right: auto"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
    <!-- 未登录 -->
    <div
      class="toLogin flex-center-center flex-col"
      v-if="!$store.state.isLoginState"
    >
      <button
        class="v-btn v-click animate__tada animate__tada"
        style="width: auto"
        @click="toLogin"
      >
        登录
      </button>
      <div class="title">您还未登录 ~</div>
    </div>
  </div>
</template>
<script>
import CartList from "@/components/ShopCart/CartList.vue";
import { clearAllShopCart, deleteShopcartByIds } from "@/api/shopcart/shopcart";
export default {
  components: { CartList },
  name: "ShopcarView",
  data() {
    return {
      selectList: [], // 选中的坐标
      cartList: [], // 用户的购物车列表
      isEdit: false, // 编辑状态
      selectAll: false, // 选中状态
      finallPrice: 0,
      counts: 0,
    };
  },
  computed: {
    getFinallPrices() {
      return this.finallPrice * 100;
    },
    getCartCount() {
      return this.$children;
    },
  },
  methods: {
    // 获取长度
    getCartLength(cartList) {
      this.cartList = cartList;
      this.counts = cartList.length;
    },

    // 获取选中的组合
    changeSelectArr(selectList) {
      this.finallPrice = 0; // 清空
      this.selectList = selectList;
      this.selectList.forEach((i) => {
        this.finallPrice =
          this.finallPrice +
          (this.cartList[i].unitPrice + this.cartList[i].postage) *
            this.cartList[i].quantity;
      });
    },

    // 提交选择的商品
    async onSubmitOrder() {
      // 提交的商品列表
      const goodsList = [];
      this.selectList.forEach((i) => {
        goodsList.push({
          ...this.cartList[i],
          id: this.cartList[i].goodsItemId, // 选中商品id
          gid: this.cartList[i].goodsId,
          images: this.cartList[i].icon,
          price: this.cartList[i].unitPrice,
        });
      });
      this.$router.push({
        name: "checkorder",
        params: {
          animate: "forward",
          toBack: "true",
        },
        query: {
          // 传参
          info: {
            price: this.finallPrice, // 最终价格
          },
          goodsList,
        },
      });
    },

    // 批量删除的商品
    async deleteShopCart() {
      // console.log(this.$children);
      // id集合
      let ids = [];
      this.selectList.forEach((p) => {
        ids.push(this.cartList[p].id);
      });
      this.$dialog
        .confirm({
          title: "是否删除选中 ?",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await deleteShopcartByIds(
                ids,
                this.$store.getters.token
              );
              // console.log(res.data);
              if (res.status === 200 && res.data.success) {
                this.selectList.forEach((p) => {
                  this.$children[0].cartList.splice(p, 1);
                });
                this.$children[0].selectList.splice(0);
                done();
                this.cartList = this.$toast({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$toast({ type: "fail", message: "删除失败!" });
              }
            } else {
              done();
            }
          },
        })
        .catch(() => {});
    },
    // 批量删除的商品
    async deleteAllCart() {
      // console.log(this.$children);
      this.$dialog
        .confirm({
          title: "是否清空购物车 ?",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await clearAllShopCart(this.$store.getters.token);
              // console.log(res.data);
              if (res.status === 200 && res.data.success) {
                this.$children[0]?.cartList?.splice(0);
                this.$children[0]?.selectList?.splice(0);
                done();
                this.cartList = this.$toast({
                  type: "success",
                  message: "清除成功!",
                });
              } else {
                this.$toast({ type: "fail", message: "删除失败!" });
              }
            } else {
              done();
            }
          },
        })
        .catch(() => {});
    },

    toLogin() {
      this.$router.push({
        name: "login",
        params: {
          animate: "forward",
          toBack: "true",
        },
      });
    },
  },
};
</script>
  <style scoped>
/* 登录 */
.toLogin {
  width: 100%;
  height: 100vh;
}
.toLogin .title {
  padding: 0.2rem;
}
/* 主内容 */
.shop-view {
  width: 100%;
  min-height: 100vh;
}
.bar {
  position: fixed;
  bottom: 1.8rem;
  box-shadow: var(--shadow-color2);
}
/* 顶部 */
.top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  padding: 0.3rem;
  background-color: transparent;
  backdrop-filter: blur(30px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.top .title .big {
  cursor: pointer;
  font-size: 0.5rem;
  font-weight: 600;
}
.top .edit {
  font-size: 0.35rem;
  cursor: pointer;
}
/* 动画 */
.submits {
  animation: 0.5s fadeInUp;
}
.deletes {
  animation: 0.5s fadeInUp;
}
</style>