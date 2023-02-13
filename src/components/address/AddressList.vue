<template>
  <div class="address-list">
    <!-- 列表 -->
    <van-list
      class="list"
      v-if="!isEmpty"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getAllAddressList"
    >
      <!-- 地址卡片 -->
      <address-card
        v-for="(p, i) in addressList"
        :key="p.id"
        :item="p"
        @toEdit="toEdit"
        @deleteAddressByIndex="deleteAddressByIndex"
        :index="i"
        v-bind="$attrs"
      />
    </van-list>
    <div class="nav">
      <button class="v-btn">添加新地址</button>
    </div>

    <!-- 表单弹窗 -->
    <van-popup
      closeable
      class="flex-col address-popup"
      v-model="showAddress"
      position="center"
      round
    >
      <van-form @submit="addAddress" class="form">
        <label class="title">收货地址</label>
        <!-- 收货人 -->
        <van-field
          label="收货人"
          clear-trigger="always"
          placeholder=" 收货人姓名"
          type="text"
          name="name"
          v-model="address.name"
          class="v-input"
          :rules="[{ required: true }]"
        />
        <!-- 手机号 -->
        <van-field
          label="手机号"
          clear-trigger="always"
          placeholder=" 收货人手机号"
          type="tel"
          name="phone"
          v-model="address.phone"
          class="v-input"
          :rules="[{ required: true }]"
        />
        <!-- 地区 -->
        <van-field
          label="地区"
          clear-trigger="always"
          placeholder=" 点击选择"
          type="tel"
          name="area"
          v-model="area"
          class="v-input v-click"
          :rules="[{ required: true }]"
          right-icon="arrow"
          readonly
          @click="showArea = true"
        />
        <!-- 详细地址 -->
        <van-field
          label="详细地址"
          clear-trigger="always"
          placeholder=" 如街道、门牌号、小区、乡镇、村等"
          type="textarea"
          v-model="address.address"
          name="address"
          class="v-input textarea"
          :rules="[{ required: true }]"
        >
          <template #right-icon>
            <div class="flex-center-center flex-col" @click="getLocation">
              <van-icon name="location" clss="tip" />
              <span class="tip">定位</span>
            </div>
          </template>
        </van-field>
        <!-- 默认地址 -->
        <van-cell center title="默认地址">
          <template #right-icon>
            <van-switch
              v-model="address.isDefault"
              name="isDefault"
              size="0.5rem"
            />
          </template>
        </van-cell>
        <!-- 按钮 -->
        <div class="btn-group">
          <!-- 取消或删除 -->
          <input
            class="v-btn v-cancel"
            type="button"
            :value="isEdit ? '删除' : '取消'"
            @click="isEdit ? deleteAddress() : (showAddress = false)"
          />
          <input class="v-btn" type="submit" value="保存" />
        </div>
      </van-form>
    </van-popup>

    <!-- 地区弹窗 -->
    <van-popup v-model="showArea" position="bottom" class="area-popup" round>
      <van-area
        title="地区"
        :area-list="areaList"
        @confirm="setArea"
        @cancel="showArea = false"
      />
    </van-popup>

    <!-- 网络错误 -->
    <error-card
      v-if="isEmpty || isError"
      @refresh="showAddress = true"
      :btn-text="isError ? '刷新' : '新建地址'"
      :image="isError ? 'network' : 'default'"
      :text="isError ? '网络错误，请稍后重试！' : '还没有收获地址哦~'"
      class="error"
    />
  </div>
</template>
  
  <script>
import ErrorCard from "@/components/ErrorCard.vue";
import { areaList } from "@vant/area-data";

import { getAllAddress } from "@/api/user/address";
import AddressCard from "./AddressCard.vue";
export default {
  components: { ErrorCard, AddressCard },
  name: "AddressList",
  data() {
    return {
      address: {
        name: "",
        phone: "",
        province: "", //省份
        city: "", //
        district: "", //区/县
        address: "", //详细收货地址
        isDefault: 0, //是否默认收货地址
      },
      area: "",
      areaList, // 区县集合
      showAddress: false, // 显示地址表单
      showArea: false, // 显示地址list

      isError: false,
      isEmpty: false,

      isEdit: false,

      // 数据
      addressList: [],
      active: 0,
      // 记载
      loading: false,
      finished: false,
    };
  },
  watch: {
    "address.isDefault": {
      handler(newVal) {
        this.address.isDefault = +newVal;
      },
    },
  },
  methods: {
    // 获取所有地址
    async getAllAddressList() {
      this.loading = true;
      const res = await getAllAddress(this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        const data = res.data.data;
        this.loading = false;
        data.forEach((p) => {
          if (p.isDefault) {
            this.addressList.unshift(p);
          } else {
            this.addressList.push(p);
          }
        });
        if (data.length === this.addressList.length) {
          this.finished = true;
        }
        this.$store.commit("setAddressList", data);
      } else if (res.status === 200 && !res.data.success) {
        this.isEmpty = true;
      } else {
        this.isError = true;
      }
    },

    // 添加地址
    addAddress() {
      console.log(this.address);
    },
    // 更新地址
    setDefaultAddress() {},

    // 删除单个地址
    deleteAddressByIndex(i) {
      this.addressList.splice(i, 1);
    },

    // 获取定位
    getLocation() {
      console.log("定位");
    },
    // 显示
    onShow() {
      for (const key in this.address) {
        this.address[key] = "";
      }
      this.isEdit = false;
      this.showAddress = true;
    },
    // 加入单例编辑
    toEdit(item, i) {
      console.log(1);
      for (const key in item) {
        this.$set(this.address, key, item[key]);
      }
      this.isEdit = true;
      this.showAddress = true;
      this.active = i;
    },

    // 设置区域
    setArea(info) {
      this.area = `${info[0].name} ${info[1].name} ${info[2].name}`;
      (this.address.province = info[0].name), //省份
        (this.address.city = info[1].name), // 市
        (this.address.district = info[2].name), //区/县
        (this.showArea = false);
    },
  },
};
</script>
<style scoped>
/* 空 */
.error .v-btn {
  width: 100%;
}
/* 表单弹窗 */
.form .v-input {
  margin: 0.3rem 0;
}
.form >>> .van-field__label {
  width: auto;
  min-width: 3em;
  font-weight: 600;
  display: inline-block;
  text-align: justify;
  text-justify: distribute-all-lines;
  text-align-last: justify;
}
/* 详细地址 */
.form .textarea {
  border-radius: 16px;
}
.form .textarea >>> .van-field__right-icon {
  font-size: 0.5rem;
  color: var(--tip-color2);
  cursor: pointer;
}
.form .textarea >>> .tip {
  font-size: 0.3rem;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-color4);
}
/* 地址弹窗 */
.area-popup {
  width: 100%;
}
.address-popup {
  width: 94%;
  padding: 0.4rem;
}
.address-popup .title {
  display: block;
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
  width: 100%;
  text-align: center;
  font-size: 0.5rem;
}
.form .v-btn {
  width: 40%;
  border-radius: 8px;
  padding: 0.2rem;
}
</style>