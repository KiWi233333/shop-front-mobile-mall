<template >
  <div class="v-card item">
    <!-- 选中插槽 -->
    <slot name="checkbox"></slot>
    <img :src="getImgSrc" class="img" />
    <div class="content">
      <div class="title">{{ item.name }}</div>
      <p class="props">{{ item.props }}</p>
      <div class="price">￥{{ item.unitPrice }}</div>
    </div>
    <!-- 件数 -->
    <van-stepper
      v-if="!$attrs.isEdit"
      :disabled="Number(item.stock) <= 0"
      class="animate__animated animate__fadeInUp"
      style="margin-top: auto"
      :default-value="item.quantity"
      :value="item.quantity"
      async-change
      @change="onSubChange"
      name="nums"
      integer
      min="1"
      max="99"
      input-width="0.6rem"
      button-size="0.6rem"
    />
    <van-icon
      class="icons v-click"
      v-else
      name="minus"
      size="0.4rem"
      color="var(--theme-color)"
      @click="deleteShopCartById"
    />
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import { updateShopCartProps } from "@/api/shopcart/shopcart";
export default {
  name: "CartCard",
  props: ["item", "index"],
  data() {
    return {
      num: 1,
    };
  },
  methods: {
    async onSubChange(newVal) {
      this.$toast.loading({ forbidClick: true, duration: 0 });
      // 修改数量
      const res = await updateShopCartProps(
        this.item?.id,
        this.item?.goodsItemId,
        newVal,
        this.$store.getters.token
      );
      if (res.status === 200 && res.data.success) {
        this.$set(this.item, "quantity", newVal);
        this.$toast.clear();
      } else {
        this.$toast.fail("修改失败！");
      }
    },

    // 删除该商品购物车
    deleteShopCartById() {
      this.$emit("deleteCartByOne", this.item.id, this.index);
    },
  },
  computed: {
    getImgSrc() {
      return getResourImageByName(this.item?.icon);
    },
  },
  watch: {
    // 修改数量
    num(newVal) {
      this.$set(this.item, "quantity", newVal);
    },
  },
};
</script>
  <style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img {
  width: 2rem;
  height: 2rem;
  object-fit: cover;
  box-shadow: var(--shadow-color3);
  border-radius: 8px;
  margin: 0 0.2rem;
}
.content {
  flex: 1;
}
.content .props {
  cursor: pointer;
  display: inline-block;
  max-width: 3.6rem;
  color: var(--text-color3);
  background-color: var(--bg-color5);
  border-radius: 0.4em;
  padding: 0.08rem 0.15rem;
  font-size: 0.25rem;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
}
.content .price {
  color: var(--tip-color2);
  font-size: 0.45rem;
}
.content .price::first-letter {
  font-size: 0.3rem;
}

.icons {
  background-color: var(--tip-color2);
  border-radius: 50%;
  width: 0.6rem;
  height: 0.6rem;
  padding: 0.1rem;
  animation: 0.5s fadeInRight;
  cursor: pointer;
}
</style>