<template>
  <default-page title="订单" class="check-order">
    <div class="contain" v-if="!isError">
      <!-- 地址卡片栏 -->
      <address-card
        class="v-card v-click"
        :item="defaultAddress"
        :readonly="true"
        @click="showAddressList = true"
      >
        <template #right-icon>
          <van-icon
            name="arrow"
            class="icons"
            size="0.6rem"
            color="var(--text-color3)"
          />
        </template>
      </address-card>
      <div class="v-card" v-if="goodsList.length > 0">
        <!-- 商品 -->
        <goods-info
          v-for="(p, i) in goodsList"
          :key="p.id"
          :goods="p"
          :price="info[i]?.price"
          :props="info[i]?.props"
          :num="info[i]?.num"
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
              class="remark"
              placeholder="无备注"
              v-model="remark"
              maxlength="30"
              :border="false"
              :clearable="true"
            />
          </menu-item>
        </div>
      </div>
      <div class="v-card all-price">
        <div class="title">价格明细</div>
        <div class="lable-group">
          <span>
            运费<small>（共件{{ info?.length }}宝贝）</small>
          </span>
          <div class="blank"><small>￥</small>{{ getPostage }}</div>
        </div>
        <div class="lable-group">
          <span>
            商品总价<small>（共件{{ info?.length }}宝贝）</small>
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
      <van-radio-group v-model="selectPay" class="v-card pay-list">
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
              <van-radio :name="p.type" :disabled="!p.open" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <!-- 提交订单 -->
      <van-submit-bar
        :price="allPrice"
        button-text="提交订单"
        @submit="onPutOrder"
      />
    </div>
    <!-- 网络支付 -->
    <van-popup v-model="showPayPanel" closeable>
      <div class="title">钱包</div>
    </van-popup>
    <!-- 网络错误 -->
    <error-card
      v-if="isError"
      @refresh="$router.back()"
      btn-text="返回"
      image="error"
      text="等待超时，订单关闭！"
    />
  </default-page>
</template>
<script>
import DefaultPage from "@/components/DefaultPage";
import ErrorCard from "@/components/ErrorCard";
import { getResourImageByName } from "@/api/res";
import { submitOrder } from "@/api/order/order";
import { getDefaultAddress } from "@/api/user/address";
import AddressCard from "@/components/Address/AddressCard.vue";
import GoodsInfo from "@/components/Goods/GoodsInfo.vue";
import MenuItem from "@/components/My/MenuItem.vue";
import currency from "currency.js";
import { Toast } from "vant";
export default {
  components: { ErrorCard, DefaultPage, GoodsInfo, AddressCard, MenuItem },
  name: "CheckOrder",
  data() {
    return {
      // 订单列表
      info: [],
      goodsList: [],
      defaultAddress: {},
      // 商品状况
      remark: "", // 备注
      allPrice: 0,
      allPostage: 0,

      // 功能
      showAddressList: false, // 打开地址列表
      isError: false,
      submitError: false,
      showPayPanel: false,
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
    const r = this.$route.query;
    if (r.info === "[object Object]" || r.goodsList === "[object Object]") {
      return (this.isError = true);
    }
    // 获取默认地址
    this.getDefaultAddress();
    console.log(r);
    // 加载订单和商品 总价
    r.goodsList.forEach((goods, i) => {
      this.goodsList.push(goods);
      this.info.push(r.info[i]);
      this.allPrice = this.allPrice + r.info[i].price * r.info[i].num;
      this.allPostage = this.allPostage + r.info[i].postage * r.info[i].num;
    });
    // 最总价格= 总价+运费
    this.allPrice = currency(this.allPrice).add(this.allPostage) * 100;
  },
  methods: {
    // 获取默认地址
    async getDefaultAddress() {
      const res = await getDefaultAddress(this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        for (const key in res.data.data) {
          this.$set(this.defaultAddress, key, res.data.data[key]);
        }
      } else {
        this.isError = true;
      }
    },

    // 提交订单
    onPutOrder() {
      const aid = this.defaultAddress.id;
      const items = [];
      this.info.forEach((p) => {
        items.push({ gid: p.goodsId, quantity: p.num });
      });
      Toast.loading({
        message: "提交中...",
        forbidClick: true,
        onOpened: () => {
          // 提交订单
          submitOrder(aid, items, this.remark, this.$store.getters.token)
            .then((res) => {
              console.log(res.data);
              this.submitError = res.data.success;
            })
            .catch(() => {
              this.submitError = true;
            });
        },
        // 拉起支付面板
        onClose: () => {
          if (this.submitError) {
            this.showPayPanel = true;
          }
        },
      });
      // this.timer = setTimeout(() => {

      // }, 2000);
    },

    // 获取图像地址
    getImgUrl(url) {
      return getResourImageByName(url);
    },
  },
  computed: {
    // 计算价格
    prices() {
      return currency(this.allPrice / 100).subtract(this.allPostage); //) ;
    },
    // 计算运费
    getPostage() {
      return currency(this.allPostage); //) ;
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
}
.v-card {
  border-radius: 10px;
  box-shadow: var(--shadow-color3);
  background-color: var(--theme-color);
}
/* 商品 */
.v-card {
  margin-bottom: 0.36rem;
}
/* 留言 */
.remark {
  float: left;
  width: 3rem;
  background-color: transparent;
  padding: 0;
}
.remark >>> input::placeholder {
  text-align: right;
  padding-right: 0.2rem;
  letter-spacing: 0.05rem;
  font-size: 0.36rem;
  color: var(--text-color3);
}
/* 价格明细 */
.all-price .title {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

/*  */
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
</style>