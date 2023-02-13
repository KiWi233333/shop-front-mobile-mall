<template >
  <div class="v-card address-card">
    <div class="Top">
      <div class="flex-center-center left">
        <van-icon
          v-if="item.isDefault"
          name="star"
          class="default"
          color="var(--theme-color2)"
        />
        <span class="flex-center-center tips" v-else>{{
          item?.name.slice(0, 1)
        }}</span>
      </div>
      <div class="center">
        <span class="names">{{ item?.name }}</span>
        <span class="phone">{{ item?.phone }}</span>
        <span v-show="item?.isDefault" class="default">默认</span>
        <div class="detail">{{ getArea }}</div>
      </div>
      <van-icon
        name="edit"
        class="default"
        color="var(--text-color4)"
        size="0.6rem"
        @click="toEdit"
      />
    </div>
    <div class="bottom" v-show="$attrs?.isSelectAll">
      <div @click="setDefaultAddress">设为默认</div>
      <div @click="deleteAddress">删除</div>
    </div>
  </div>
</template>
<script>
import { deleteAddressById } from "@/api/user/address";
import { Dialog, Toast } from "vant";
export default {
  name: "AddressCard",
  props: ["item", "index"],
  computed: {
    getArea() {
      const { province, city, district, address } = this.item;
      return `${province} ${city} ${district} ${address}`;
    },
  },
  methods: {
    // 开启编辑
    toEdit() {
      this.$emit("toEdit", this.item, this.index);
    },

    // 设为默认地址
    setDefaultAddress() {},

    // 删除地址
    deleteAddress() {
      Dialog.confirm({ title: "是否删除该地址？" })
        .then(() => {
          deleteAddressById(this.item.id, this.$store.getters.token)
            .then((res) => {
              if (res.data.success) {
                this.$emit("deleteAddressByIndex", this.index);
                Toast(" 删除成功！");
              } else {
                Toast(" 删除失败！");
              }
            })
            .catch(() => {
              Toast(" 取消失败！");
            });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
.address-card {
  padding: 0.3rem;
  font-size: 0.4rem;
  margin-bottom: 0.2rem;
  border-radius: 10px;
  cursor: pointer;
}
.Top {
  display: flex;
  align-items: center;
}
.Top > .left {
  margin-right: 0.3rem;
  width: 1rem;
  height: 1rem;
}
.Top .left .default {
  font-size: 1rem;
}
.left .tips {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--theme-color2);
  color: var(--text-color2);
}
.center {
  flex: 2;
}
.center .detail {
  margin: 0.2rem 0;
  padding-right: 0.2rem;
}
.center .names {
  font-weight: 600;
  font-size: 0.5rem;
}
.center .phone {
  color: var(--text-color3);
  padding: 0 0.12rem;
}
.center .default {
  border-radius: 4px;
  border: 1px solid var(--tip-color2);
  color: var(--tip-color2);
  opacity: 0.8;
  box-shadow: var(--shadow-color3);
  padding: 0.05rem 0.1rem;
  font-size: 0.3rem;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.2rem;
  border-top: 1px solid var(--border-color);
}
.bottom div {
  animation: 0.2s fadeIn;
  font-size: 0.35rem;
}
</style>