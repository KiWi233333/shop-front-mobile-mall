<template>
  <default-page :title="getTitle" class="check-order">
    <div class="contain" v-if="!isError">
      <!-- 订单状态 -->
      <div
        class="v-card flex-col order-info"
        v-if="getTitle !== '订单' && $route.query?.isOrder"
      >
        <div style="font-weight: 600">订单状态</div>
        <van-steps :active="orderStateIndex" active-color="var(--tip-color2)">
          <van-step name="0">待支付</van-step>
          <van-step name="1">待发货</van-step>
          <van-step name="2">已发货</van-step>
          <van-step name="3">已完成</van-step>
          <van-step name="4">已评论</van-step>
        </van-steps>
        <span class="btm">订单时间：{{ info.time }}</span>
      </div>
      <!-- 1）地址卡片栏 -->
      <div v-if="!emptyAddress" @click="isEdit ? showAddressSelectPanel() : ''">
        <address-card
          class="v-card v-click"
          :item="defaultAddress"
          :readonly="true"
        >
          <template #right-icon>
            <van-icon
              v-show="isEdit"
              name="arrow"
              class="icons"
              size="0.6rem"
              color="var(--text-color3)"
            />
          </template>
        </address-card>
      </div>
      <!-- 无地址 -->
      <div class="v-card address" v-if="emptyAddress" @click="toAddressView">
        <van-icon
          size="1.2rem"
          name="location"
          class="flex-center-center default"
        />
        <div class="text">您还未添加地址，点击新建地址！</div>
      </div>

      <!-- 2）商品卡片+备注 -->
      <div class="v-card" v-if="goodsList.length > 0">
        <!-- 商品 -->
        <goods-info
          class="goods-item"
          v-for="p in goodsList"
          :key="p.id"
          :goods="p"
          :price="p?.price"
          :props="p?.props"
          :num="p?.quantity"
        />
        <!-- 运费\备注 -->
        <div class="label">
          <menu-item
            title="配送服务"
            :value="`快递费${allPostage > 0 ? allPostage + '元' : '免邮'}`"
          />
          <menu-item title="订单备注">
            <van-field
              type="text"
              class="remarks"
              input-align="right"
              placeholder="无备注"
              :disabled="!isEdit"
              v-model="remarks"
              maxlength="30"
              :border="false"
              :clearable="true"
            />
          </menu-item>
        </div>
      </div>

      <!-- 3）价格明细 -->
      <div class="v-card all-price">
        <div class="title">价格明细</div>
        <div class="lable-group">
          <span>
            运费<small>（共件{{ goodsLengths }}宝贝）</small>
          </span>
          <div class="blank"><small>￥</small>{{ getPostage }}</div>
        </div>
        <div class="lable-group">
          <span>
            商品总价<small>（共件{{ goodsLengths }}宝贝）</small>
          </span>
          <div class="blank"><small>￥</small>{{ prices }}</div>
        </div>
        <div class="lable-group">
          <span>
            <van-icon name="bookmark" size="0.4rem" color="var(--tip-color2)" />
            资产<small>&nbsp;积分</small>
          </span>
          <div class="lable">无可用</div>
        </div>
      </div>

      <!-- 总价 -->
      <div class="v-card allPrice">
        <span>总价：</span>
        <span style="color: var(--tip-color2); font-size: 0.5rem"
          ><small style="color: var(--tip-color2)">￥</small
          >{{ finallyPrice }}</span
        >
      </div>
      <!-- 4）订单信息 -->
      <van-cell-group inset class="group v-card" v-if="isReadonly">
        <van-cell
          @click="copyId(info?.orderId)"
          title="订单编号："
          :value="info?.orderId"
        />
        <van-cell title="支付方式：" :value="'钱包'" />
        <van-cell title="下单时间：" :value="info?.time" />
      </van-cell-group>

      <!-- 5）选择付款方式 -->
      <van-radio-group
        v-if="!isReadonly"
        v-model="selectPay"
        class="v-card pay-list"
      >
        <van-cell-group :border="false">
          <van-cell
            v-for="p in payType"
            :key="p.type"
            :title="p.name"
            clickable
            :border="false"
            @click="selectPay = p.type"
          >
            <template #icon>
              <img
                :src="require(`@/assets/image/icon/${p.icon}`)"
                class="icon"
              />
            </template>
            <template #right-icon>
              <van-radio
                checked-color="var(--tip-color2)"
                :name="p.type"
                :disabled="!p.open"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <!-- 提交订单 -->
      <van-submit-bar
        v-if="!isReadonly"
        :disabled="emptyAddress"
        :price="Number(finallyPrice.value * 100)"
        :button-text="submitText"
        @submit="submitBtnFun"
      >
        <template #default>
          <van-popover
            v-show="isSubmit"
            v-model="showPopover"
            trigger="click"
            placement="top-start"
          >
            <div class="edot-popiup" style="padding: 0.2rem; font-size: 0.5rem">
              <div
                class="edit v-click"
                style="padding: 0.2rem"
                @click="isEdit = !isEdit"
              >
                {{ isEdit ? "取消修改" : "修改" }}
              </div>
              <div
                class="cancel v-click"
                style="padding: 0.2rem"
                @click="cancelOrder"
              >
                取消订单
              </div>
            </div>
            <template #reference>
              <van-icon name="ellipsis" size="0.5rem" class="bar-left" />
            </template>
          </van-popover>
        </template>
      </van-submit-bar>
    </div>
    <!-- 地址选择 -->
    <select-address
      :addressList="addressList"
      v-model="showselect"
      :defaultAddress="defaultAddress"
      @changeAddress="changeAddress"
    ></select-address>
    <!-- 网络支付 -->
    <van-popup
      transition="popup"
      v-model="showPayPanel"
      closeable
      round
      position="center"
      class="flex-col pay-panel"
    >
      <label class="title">待支付</label>
      <div class="price">
        <span>￥</span>
        <span class="big">{{ finallyPrice }}</span>
      </div>
      <div class="flex-center-center purse">
        <img
          :src="require('@/assets/image/icon/balance_icon.png')"
          class="icon"
        />钱包
        <small>（ 余额：￥{{ balance }} ）</small>
      </div>
      <button class="v-btn" @click="payOrder">确认付款</button>
    </van-popup>
    <!-- 网络错误 -->
    <error-card
      v-if="isError"
      @refresh="$router.back()"
      btn-text="返回"
      image="error"
      text="页面刷新，请重新进入！"
    />
  </default-page>
</template>
<script>
import DefaultPage from "@/components/DefaultPage";
import ErrorCard from "@/components/ErrorCard";
import { getResourImageByName } from "@/api/res";
import {
  cancelOrderById,
  payOrder,
  submitOrder,
  updateOrder,
} from "@/api/order/order";
import { getDefaultAddress, getAllAddress } from "@/api/user/address";
import AddressCard from "@/components/Address/AddressCard.vue";
import SelectAddress from "@/components/Address/SelectAddress";
import GoodsInfo from "@/components/Goods/GoodsInfo.vue";
import MenuItem from "@/components/My/MenuItem.vue";
import { checkText } from "@/util/xxsFilter";
import currency from "currency.js";
import { getPurseInfo } from "@/api/user/purse";
import { copyTextAsync } from "@/util/copy";
export default {
  name: "CheckOrder",
  components: {
    ErrorCard,
    DefaultPage,
    GoodsInfo,
    AddressCard,
    MenuItem,
    SelectAddress,
  },
  data() {
    return {
      // 订单列表
      info: [],
      goodsList: [],
      defaultAddress: {},
      addressList: [], // 全地址
      orderType: "",
      // 商品状况
      orderStateIndex: 0, // 进度条
      goodsLengths: 0, // 商品总数
      remarks: "", // 备注
      allPrice: 0,
      allPostage: 0,
      finallyPrice: 0,
      balance: 0,
      // 功能
      getTitle: "订单",
      isError: false, // 网络错误
      submitError: false, // 提交订单失败
      showPayPanel: false, // 打开交易的钱包
      showPopover: false, // 修改栏目
      // 地址
      emptyAddress: false, // 是否为空地址
      showselect: false, // 展示地址选择列表
      // 交易
      isEdit: true, // 是否可修改
      isSubmit: false, // 是否提交
      isPayDone: false, // 是否支付成功

      orderState: ["待支付", "已付款"], // 1) isEdit f su

      // 支付
      submitId: "", // 订单id
      submitText: "提交订单",
      // 支付方式
      selectPay: "purse",
      payType: [
        { type: "purse", icon: "balance_icon.png", name: "钱包", open: true },
        { type: "wechat", icon: "wechat.png", name: "微信", open: false },
        { type: "zfb", icon: "zfb.png", name: "支付宝", open: false },
        { type: "ysf", icon: "ysf.png", name: "云闪付", open: false },
      ],
    };
  },
  mounted() {
    // 初始化
    this.getBalance(); // 钱包
    const q = this.$route.query;
    // 订单初始化
    if (q.info === "[object Object]" || q.goodsList === "[object Object]") {
      return (this.isError = true);
    }
    this.orderType = q.orderType || ""; // 订单类型
    // 1）读取已经传入地址
    if (q.isOrder && q.info.orderId) {
      this.getAddressList(); // 获取列表
      this.checkOrderType(); // 确定订单状态
      this.submitId = q.info.orderId; // 订单id
      // console.log(q);
      const { name, phone, address } = q.info;
      this.defaultAddress.name = name;
      this.defaultAddress.phone = phone;
      this.defaultAddress.address = address;
      this.defaultAddress.id = phone;
      this.remarks = q.info.remarks;
      // 订单页面的数据
      q.goodsList.forEach((goods) => {
        this.goodsLengths = this.goodsLengths + goods.quantity;
        goods.props =
          (goods.color || "") +
          (goods.size || "") +
          (goods.combo || "") +
          (goods.edition || "");
        this.goodsList.push(goods);
        this.allPrice = currency(this.allPrice).add(goods.unitPrice);
      });
      for (const key in q.info) {
        this.$set(this.info, key, q.info[key]);
      }
      // 商品页面进入
    } else {
      // 获取默认地址
      this.getDefaultAddress();
      // 加载订单和商品 总价
      q.goodsList.forEach((goods) => {
        this.goodsList.push(goods);
        this.goodsLengths = this.goodsLengths + goods.quantity;
        this.allPrice = this.allPrice + goods.unitPrice * goods.quantity;
        this.allPostage = this.allPostage + goods.postage * goods.quantity;
      });
      // 添加订单信息
      for (const key in q?.info) {
        this.$set(this.info, key, q.info[key]);
      }
    }
    // 最总价格= 总价+运费
    this.finallyPrice = currency(this.allPrice).add(this.allPostage);
    this.allPrice *= 100;
  },
  methods: {
    // 选择地址弹窗
    showAddressSelectPanel() {
      this.showselect = true;
    },
    changeAddress(p) {
      for (const key in p) {
        this.$set(this.defaultAddress, key, p[key]);
      }
    },

    // 获取默认地址
    async getDefaultAddress() {
      const res = await getDefaultAddress(this.$store.getters.token);
      if (res.status === 200) {
        // 有默认地址
        if (res.data.success && res.data.data?.id !== "") {
          this.getAddressList(false); //获取全部地址
          for (const key in res.data.data) {
            this.$set(this.defaultAddress, key, res.data.data[key]);
          }
          // 无默认地址
        } else {
          this.getAddressList(true); // 获取第一个地址
          return;
        }
      } else {
        this.isError = true;
      }
    },

    // 获取第一个地址 或全部地址
    async getAddressList(getFirst = false) {
      const res = await getAllAddress(this.$store.getters.token);

      if (res.data.success && res.status === 200) {
        const data = res.data.data;
        if (data.length > 0 && getFirst) {
          for (const key in data[0]) {
            this.$set(this.defaultAddress, key, data[0][key]);
          }
        }
        // 添加全部地址
        this.addressList.splice(0);
        data.forEach((p) => {
          this.addressList.push(p);
        });
      }
    },

    // 初始化从订单页的订单状态
    checkOrderType() {
      this.isSubmit = true;
      this.submitId = this.info?.orderId;
      this.isEdit = false;
      switch (this.orderType) {
        case "unpaid":
          this.getTitle = "待支付";
          this.submitText = "去支付";
          this.orderStateIndex = 0;
          break;
        case "update":
          this.isEdit = true;
          this.submitText = "更新并付款";
          this.orderStateIndex = 0;
          break;
        case "undeliver":
          this.getTitle = "待发货";
          this.orderStateIndex = 1;
          break;
        case "delivered":
          this.getTitle = "已发货";
          this.orderStateIndex = 2;
          break;
        case "uncomment":
          this.getTitle = "已完成，待评论";
          this.orderStateIndex = 3;
          break;
        case "commented":
          this.getTitle = "已评论";
          this.orderStateIndex = 4;
          break;
        default:
          this.getTitle = "订单";
          break;
      }
    },

    // 复制ID
    copyId(text) {
      copyTextAsync(text)
        .then(() => {
          this.$toast({ message: "复制成功！", position: "bottom" });
        })
        .catch(() => {
          this.$toast({ message: "用户取消了复制！", position: "bottom" });
        });
    },

    // 提交按钮
    submitBtnFun() {
      if (this.orderType && this.isSubmit != "") {
        switch (this.orderType) {
          case "unpaid":
            this.showPayPanel = true;
            break;
          case "update":
            this.updateOrders(); // 更新
            break;
          case "undeliver":
            this.submitText = "undeliver";
            break;
          case "delivered":
            this.submitText = "delivered";
            break;
          case "comment":
            break;
        }
      } else {
        // 修改或提交订单
        this.isSubmit ? this.updateOrders() : this.onPutOrder();
      }
    },

    // 1）提交订单
    onPutOrder() {
      if (this.emptyAddress || !this.defaultAddress.id || this.isSubmit)
        return this.$toast("地址不能为空！");
      const aid = this.defaultAddress.id; // 地址id
      const items = [];
      // 属性id * 数量
      this.goodsList.forEach((p) => {
        items.push({ gid: p.id, quantity: p.quantity });
      });
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        onOpened: async () => {
          // 提交订单
          const res = await submitOrder(
            aid,
            items,
            checkText(this.remarks),
            this.$store.getters.token
          );
          if (res.status === 200 && res.data.success) {
            this.submitId = res.data.data;
            this.isEdit = false; // 关闭编辑
            this.isSubmit = true;
            this.submitError = false;
            this.submitText = "待支付";
          } else {
            this.submitError = true;
          }
        },
        // 拉起支付面板
        onClose: () => {
          if (this.submitError) {
            this.showPayPanel = false;
            this.$toast({ type: "fail", message: "提交失败！" });
          } else {
            this.showPayPanel = true;
          }
        },
      });
    },

    // 2) 发起支付订单
    payOrder() {
      this.showPayPanel = false;

      if (this.submitId === "") return;
      this.$toast.loading({
        message: "支付中...",
        forbidClick: true,
        onOpened: async () => {
          const res = await payOrder(this.submitId, this.$store.getters.token);
          this.isPayDone = res.data.success;
          this.showPayPanel = false;
        },
        onClose: () => {
          if (this.isPayDone) {
            this.$toast({
              type: "success",
              message: "支付成功！",
              forbidClick: true,
            });
            this.$router.replace({
              name: "order",
              params: { animate: "forward" },
            });
          } else {
            this.$toast({
              type: "fail",
              message: "余额不足",
              forbidClick: true,
            });
          }
        },
      });
    },

    // 3) 修改订单
    async updateOrders() {
      if (this.isEdit) {
        if (this.submitId === "") return;
        const res = await updateOrder(
          this.submitId,
          this.defaultAddress.id,
          checkText(this.remarks),
          this.$store.getters.token
        );
        if (res.status === 200 && res.data.success) {
          this.showPayPanel = true;
          this.submitId = res.data.data?.orderId;
        } else {
          this.$toast("修改失败，请重新提交！");
        }
      } else {
        this.showPayPanel = true;
      }
    },
    // 4) 取消订单
    async cancelOrder() {
      if (this.submitId === "") return;
      this.$dialog
        .confirm({
          title: "是否取消订单？",
          beforeClose: (action, done) => {
            if (action === "confirm") {
              setTimeout(async () => {
                const res = await cancelOrderById(
                  this.submitId,
                  this.$store.getters.token
                );
                if (res.status === 200 && res.data.success) {
                  done();
                  this.$toast({ message: "取消成功！", type: "success" });
                  this.$router.back();
                } else {
                  this.$toast("取消失败，请重新提交！");
                }
              }, 1000);
            } else {
              done();
            }
          },
        })
        .catch(() => {});
    },

    // 获取钱包
    getBalance() {
      getPurseInfo(this.$store.getters.token)
        .then((res) => {
          this.balance = currency(res.data.data.balance);
        })
        .catch(() => {});
    },

    // 跳转到地址页面
    toAddressView() {
      this.$router.push({
        name: "address",
        params: {
          animate: "forward",
          toBack: true,
        },
      });
    },
    // 获取图像地址
    getImgUrl(url) {
      return getResourImageByName(url);
    },
  },
  computed: {
    // 计算价格
    prices() {
      return currency(this.allPrice / 100);
    },
    // 只读
    isReadonly() {
      if (this.orderType !== "") {
        return !(this.orderType === "update" || this.orderType === "unpaid");
      } else {
        return false;
      }
    },

    // 计算运费
    getPostage() {
      if (this.allPostage) {
        return currency(this.allPostage);
      } else {
        return "免运费";
      }
    },
  },
  watch: {
    defaultAddress: {
      deep: true,
      immediate: true,
      handler() {
        this.emptyAddress = this.defaultAddress?.id === "";
      },
    },
  },
};
</script>
<style scoped>
.check-order {
  background-color: #eeeeee5e;
  min-height: 100vh;
  padding: 0;
}
.contain {
  padding: 0.1rem;
  margin-bottom: 1.4rem;
}
.v-card {
  border-radius: 10px;
  box-shadow: var(--shadow-color3);
  background-color: var(--theme-color);
}
.address {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  font-size: 0.42rem;
  font-size: 600;
  cursor: pointer;
}
.address .default {
  margin: 0 0.2rem;
  color: var(--tip-color2);
}
.order-info >>> .van-steps {
  padding: 0;
  margin-top: 0.3rem;
}
.order-info >>> .van-step__title {
  font-size: 0.3rem;
}
.order-info .btm {
  font-size: 0.35rem;
  color: var(--text-color3);
}
.top-order {
  display: flex;
  align-items: center;
}
.top-order .left {
  margin: 0.2rem;
}
.top-order .right div {
  margin-bottom: 0.2rem;
}
.top-order .right .top {
  color: var(--tip-color2);
}

/* 商品 */
.v-card {
  margin-bottom: 0.36rem;
}
/* 留言 */
.remarks {
  float: left;
  width: 3rem;
  background-color: transparent;
  padding: 0;
}
.remarks >>> input::placeholder {
  text-align: right;
  padding-right: 0.2rem;
  letter-spacing: 0.05rem;
  font-size: 0.36rem;
  color: var(--text-color3);
}
.goods-item {
  margin: 0.2rem 0;
}
/* 价格明细 */
.all-price .title {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

/* 支付 */
.pay-list >>> .van-cell {
  padding: 0.2rem 0;
}
.pay-list .icon {
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  object-fit: cover;
  margin-right: 0.3rem;
}
.van-cell__title >>> span {
  font-size: 0.4rem;
}

/* pay-panel */
.pay-panel {
  height: 7rem;
  width: 90%;
  padding: 0.4rem 0.3rem;
  padding-bottom: 0.6rem;
  align-items: center;
  justify-content: space-between;
}
.pay-panel .title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 0.55rem;
  margin: 0.4rem 0;
}
.pay-panel >>> .van-popup__close-icon {
  top: 0.4rem;
  right: 0.4rem;
}
.pay-panel .price {
  margin: 0.2rem 0;
  text-align: center;
}
.pay-panel .price span {
  font-weight: 600;
  font-size: 0.8rem;
}
.pay-panel .price .big {
  font-size: 1.2rem;
}
.pay-panel .icon {
  height: 2em;
  margin: 0.2rem;
}

/* 修改 */
.bar-left {
  cursor: pointer;
  padding: 0 0.2rem;
}
.check-order >>> .edit-popup >>> .item {
  padding: 0.2rem;
}

/* 订单信息 */
.group {
  width: 100%;
  margin: 0.4rem 0;
}
.allPrice {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.group >>> .van-cell {
  padding: 0.2rem 0;
}
.check-order >>> .van-submit-bar__button {
  width: auto;
}
</style>