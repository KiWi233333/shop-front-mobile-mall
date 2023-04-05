<template >
  <div class="address-card">
    <div class="Top">
      <div class="flex-center-center left">
        <van-icon
          v-if="item.isDefault"
          size="0.6rem"
          name="location"
          class="flex-center-center default"
        />
        <span class="flex-center-center tips" v-else>
          {{ item.name ? item?.name.slice(0, 1) : "" }}
        </span>
      </div>
      <div class="center">
        <span class="names">{{ item?.name }}</span>
        <span class="phone">{{ item?.phone }}</span>
        <span v-show="item?.isDefault" class="default">默认</span>
        <div class="detail" v-show="item?.province">{{ getArea }}</div>
        <div class="detail">{{ item?.address }}</div>
      </div>
      <van-icon
        v-if="!readonly"
        name="edit"
        class="default"
        color="var(--text-color4)"
        size="0.6rem"
        @click="toEdit"
      />
      <slot name="right-icon"></slot>
    </div>
    <div class="bottom" v-if="!readonly" v-show="$attrs?.isSelectAll">
      <slot @click="setDefaultAddress"></slot>
      <div @click="deleteAddress">删除</div>
    </div>
  </div>
</template>
<script>
import { deleteAddressById } from "@/api/user/address";
export default {
  name: "AddressCard",
  props: {
    item: { required: true },
    index: { required: false },
    readonly: { required: false, default: false },
  },
  computed: {
    getArea() {
      const { province, city, district } = this.item;
      return `${province} ${city} ${district}`;
    },
  },
  methods: {
    // 开启编辑
    toEdit() {
      this.$emit("toEdit", this.item, this.index);
    },

    // 删除地址
    deleteAddress() {
      this.$dialog
        .confirm({ title: "是否删除该地址？" })
        .then(() => {
          deleteAddressById(this.item.id, this.$store.getters.token)
            .then((res) => {
              if (res.data.code === 20011) {
                this.$emit("deleteAddressByIndex", this.index);
                this.$toast(" 删除成功！");
              } else {
                this.$toast(" 删除失败！");
              }
            })
            .catch(() => {
              this.$toast(" 取消失败！");
            });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
.address-card {
  padding: 0.2rem;
  font-size: 0.4rem;
  margin-bottom: 0.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.Top {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.Top > .left {
  margin: 0.2rem;
  margin-right: 0.4rem;
  width: 1.2rem;
  height: 1.2rem;
}
.Top .left .default {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--tip-color2);
  opacity: 0.8;
  padding: 0.16rem;
  fill: var(--text-color2);
  color: var(--text-color2);
  font-weight: 600;
}
.Top .center {
  flex: 2;
}
.left .tips {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--theme-color2);
  color: var(--text-color2);
}
.center .detail {
  margin: 0.15rem 0;
  padding-right: 0.3rem;
  font-size: 0.36rem;
}
.center .names {
  font-weight: 600;
  font-size: 0.4rem;
}
.center .phone {
  color: var(--text-color3);
  padding: 0 0.12rem;
  font-size: 0.32rem;
}
.center .default {
  border-radius: 4px;
  border: 1px solid var(--tip-color2);
  color: var(--tip-color2);
  opacity: 0.8;
  box-shadow: var(--shadow-color3);
  padding: 0.05rem 0.1rem;
  font-size: 0.24rem;
}
/* 编辑 */
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