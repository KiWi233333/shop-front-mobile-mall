<template >
  <div class="cart-list">
    <!-- 列表 -->
    <van-list
      class="list"
      v-if="!isEmpty"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getAllShopCartList"
    >
      <!-- 1) 多选组 -->
      <van-checkbox-group v-model="selectList" @change="changeSelectArr">
        <transition-group name="bottomRight" tag="div">
          <!-- 购物车卡片 -->
          <cart-card
            v-bind="$attrs"
            v-for="(item, i) in cartList"
            :key="item.id"
            :item="item"
            :index="i"
            @onSelectProps="onSelectProps(item?.goodsId, item?.id)"
            @deleteCartByOne="deleteCartByOne"
            @updataShopcart="updataShopcart"
          >
            <template #checkbox>
              <!-- 2)插槽多选框 -->
              <van-checkbox
                icon-size="0.5rem"
                :name="i"
                checked-color="var(--tip-color2)"
              ></van-checkbox>
            </template>
          </cart-card>
        </transition-group>
      </van-checkbox-group>
    </van-list>
    <!-- 属性 -->
    <goods-sku
      @updataShopcart="updataShopcart"
      :GOOD_ID="GOOD_ID"
      v-model="showSku"
      :cartId="shopcartId"
    />
  </div>
</template>
<script>
import CartCard from "@/components/ShopCart/CartCard";
import { getAllShopCart, deleteOneShopCart } from "@/api/shopcart/shopcart";
import GoodsSku from "@/components/GoodsSku.vue";
export default {
  components: { CartCard, GoodsSku },
  name: "CartList",
  data() {
    return {
      loading: false,
      finished: false,
      isEmpty: false,
      selectList: [], // 坐标
      cartList: [], // 购物车列表

      // 当前gid
      GOOD_ID: "",
      // 当前购物车id
      shopcartId: "",

      // 属性切换
      showSku: false,
    };
  },
  methods: {
    // 1) 购物车 功能
    // 获取全部购物车列表
    async getAllShopCartList() {
      this.loading = true;
      const res = await getAllShopCart(this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        const data = res.data.data;
        if (data.length === 0) {
          this.loading = false;
          this.finished = true;
          return;
        }
        let count = 0;
        let timer = setInterval(() => {
          const p = data[count];
          p.props = `${p?.color || ""} ${p?.size || ""} ${p?.edition || ""} ${
            p?.combo || ""
          }`;
          this.cartList.push(p);
          count++;
          if (count >= data?.length) {
            this.loading = false;
            this.finished = true;
            clearInterval(timer);
            timer = "";
            this.$emit("getCartLength", data);
          }
        }, 100);
      } else if (res.status === 200 && !res.data.success) {
        this.isEmpty = true;
      } else {
        this.isEmpty = true;
      }
    },
    // 获取选中的项目
    changeSelectArr(arr) {
      this.$emit("changeSelectArr", arr, this.cartList);
    },

    updataShopcart() {
      this.cartList.splice(0);
      this.getAllShopCartList();
    },

    // 删除单一购物车
    async deleteCartByOne(id, i) {
      this.$toast.loading({
        message: "删除中...",
        forbidClick: true,
        duration: 0,
      });
      const res = await deleteOneShopCart(id, this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        this.cartList.splice(i, 1);
        this.$toast.clear();
      } else {
        this.$toast.fail("删除购物车失败！");
      }
    },

    // 2) 属性修改 功能
    // 改变gid
    onSelectProps(GOOD_ID, shopcartId) {
      this.showSku = true;

      this.GOOD_ID = GOOD_ID;
      this.shopcartId = shopcartId;
    },
  },

  watch: {
    // 列表发生改变
    cartList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit("changeSelectArr", this.selectList, val);
        this.$emit("getCartLength", this.cartList); // 传出
      },
    },

    // 全选和 取消全选
    "$attrs.selectAll": {
      handler(val) {
        if (val) {
          this.cartList.forEach((p, i) => {
            this.selectList.push(i);
          });
          console.log(this.selectList);
        } else {
          this.selectList.splice(0);
        }
      },
    },
  },
};
</script>
<style scoped>
.cart-list {
  margin-top: 1.4rem;
  padding-top: 0.2rem;
  padding-bottom: 3.4rem;
  border-radius: 12px 12px 0 0;
  background-color: var(--theme-color);
  border-top: 1px solid var(--border-color);
  /* box-shadow: var(--shadow-color4); */
}
.item {
  /* box-shadow: var(--shadow-color3); */
  box-shadow: none;
  background-color: var(--theme-color);
  margin: 0.3rem 0.1rem;
}
</style>