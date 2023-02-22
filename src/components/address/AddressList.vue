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
      <van-checkbox-group v-model="selectList">
        <transition-group name="bottomRight" tag="div">
          <!-- 地址卡片 -->
          <address-card
            class="v-card"
            v-for="(p, i) in addressList"
            :key="i"
            :item="p"
            @toEdit="toEdit"
            @deleteAddressByIndex="deleteAddressByIndex"
            :index="i"
            v-bind="$attrs"
          >
            <van-checkbox
              icon-size="0.5rem"
              :name="i"
              checked-color="var(--tip-color2)"
              >选中
            </van-checkbox>
          </address-card>
        </transition-group>
      </van-checkbox-group>
    </van-list>
    <!-- 按钮 -->
    <div class="nav">
      <!-- 添加新地址 -->
      <button
        class="v-btn"
        v-show="!$attrs.isSelectAll"
        @click="onAddress"
        key="add"
      >
        添加新地址
      </button>
      <!-- 全选和删除 -->
      <div class="select" v-show="$attrs.isSelectAll" key="select">
        <van-checkbox
          v-model="selectAll"
          icon-size="0.5rem"
          checked-color="var(--tip-color2)"
          >全选
        </van-checkbox>
        <button class="v-btn" @click="deleteAddressByIdsArray">删除选中</button>
      </div>
    </div>

    <!-- 表单弹窗 -->
    <van-popup
      transition="popup"
      closeable
      class="flex-col address-popup"
      v-model="showAddress"
      position="center"
      round
    >
      <van-form @submit="toSubmit" class="form">
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
          placeholder="收货人手机号"
          type="tel"
          name="phone"
          v-model="address.phone"
          class="v-input"
          :rules="[
            {
              required: true,
              pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            },
          ]"
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
          maxlength="40"
          v-model="address.address"
          show-word-limit
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
import AddressCard from "@/components/Address/AddressCard.vue";
import { areaList } from "@vant/area-data";

import {
  deleteAddressById,
  deleteAddressByIdsArray,
  getAllAddress,
  putAddres,
  updateAddress,
} from "@/api/user/address";
import { Dialog, Toast } from "vant";
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
      // defaultCount: 0, // 默认数量
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
      selectList: [],
      selectAll: false,
      // 加载
      loading: false,
      finished: false,
    };
  },
  methods: {
    // 判断 添加 / 修改
    toSubmit() {
      this.isEdit ? this.reqUpdateAddress() : this.reqAddAddress();
    },

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
      } else if (res.status === 200 && !res.data.success) {
        this.isEmpty = true;
      } else {
        this.isError = true;
      }
    },

    // 显示添加地址弹窗
    onAddress() {
      for (const key in this.address) {
        this.address[key] = "";
      }
      this.isEdit = false;
      this.showAddress = true;
    },
    // 添加地址
    async reqAddAddress() {
      const res = await putAddres(this.address, this.$store.getters.token);
      //   console.log(res.data);
      if (res.status === 200 && res.data.success) {
        Toast({ type: "success", position: "bottom", message: "添加成功！" });

        const newAddress = JSON.parse(JSON.stringify(this.address));
        if (newAddress.isDefault) {
          this.addressList[0].isDefault = false;
          this.addressList.unshift(newAddress);
        } else {
          this.addressList.push(newAddress);
        }
      } else {
        Toast({ position: "bottom", message: "添加失败！" });
      }
      this.showAddress = false;
    },

    // 加入单例编辑
    toEdit(item, i) {
      for (const key in item) {
        this.$set(this.address, key, item[key]);
      }
      this.area = `${item.province} ${item.city} ${item.district}`;
      this.active = i;
      this.isEdit = true;
      this.showAddress = true;
    },
    // 更新地址
    async reqUpdateAddress() {
      const index = this.active;
      const res = await updateAddress(this.address, this.$store.getters.token);
      //   console.log(res.data);
      if (res.status === 200 && res.data.success) {
        const newAddress = JSON.parse(JSON.stringify(this.address));
        if (this.address.isDefault) {
          // 默认地址
          this.addressList[0].isDefault = false; // 取消其他默认
          this.addressList.splice(index, 1); // 移除
          this.addressList.unshift(newAddress); // 添加到头部
        } else {
          // 不是默认地址
          this.addressList.splice(index, 1, newAddress);
        }
        Toast({ type: "success", position: "bottom", message: "修改成功！" });
      } else {
        Toast({ position: "bottom", message: "修改失败！" });
      }
      this.showAddress = false;
    },

    // 删除地址
    deleteAddress() {
      Dialog.confirm({ title: "是否删除该地址？" })
        .then(() => {
          deleteAddressById(
            this.addressList[this.active].id,
            this.$store.getters.token
          )
            .then((res) => {
              if (res.data.success) {
                this.addressList.splice(this.active, 1);
                Toast(" 删除成功！");
              } else {
                Toast(" 删除失败！");
              }
            })
            .catch(() => {
              Toast(" 删除失败！");
            });
        })
        .catch(() => {})
        .finally(() => {
          this.showAddress = false;
        });
    },
    // 删除单个本地地址
    deleteAddressByIndex(i) {
      this.addressList.splice(i, 1);
    },

    // 删除多个地址
    deleteAddressByIdsArray() {
      let ids = []; // ids
      const selects = JSON.parse(JSON.stringify(this.selectList));
      // 根据下标获取ids
      for (let i = 0; i < selects.length; i++) {
        ids.push(this.addressList[selects[i]].id);
      }
      console.log(ids, selects);
      Dialog.confirm({
        title: "确认删除选中？",
        message: `共${selects.length}条地址`,
      })
        .then(async () => {
          const res = await deleteAddressByIdsArray(
            ids,
            this.$store.getters.token
          );
          // console.log(res.data);
          if (res.data.success && res.status === 200) {
            // 删除多个
            selects.forEach((p) => {
              this.addressList.splice(p, 1);
            });
            this.selectList.splice(0);
            Toast({ position: "bottom", message: "删除成功！" });
          } else {
            Toast({ position: "bottom", message: "删除失败！" });
          }
        })
        .catch(() => {});
    },

    // 添加默认地址

    // 获取定位
    getLocation() {
      console.log("定位");
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
  watch: {
    // 全选同步
    selectAll(newVal) {
      if (newVal) {
        this.addressList.forEach((p, i) => {
          this.selectList.push(i);
        });
      } else {
        this.selectList.splice(0);
      }
    },

    //
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
/* 添加 */
.nav {
  background-color: var(--text-color2);
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.nav .v-btn {
  width: 80%;
  padding: 0.2rem;
  font-size: 0.45rem;
  margin: 0.4rem;
  animation: 0.3s fadeInUp;
}
.nav .select {
  animation: 0.3s fadeInUp;
  display: flex;
  justify-content: space-around;
}
.nav .select .v-btn {
  width: 70%;
  padding: 0.2rem 0.5rem;
  margin: 0.4rem;
  font-size: 0.45rem;
  background-color: var(--tip-color2);
  color: var(--text-color2);
}
</style>