<template>
  <default-page title="账单">
    <div class="Bills-view" v-show="!isEmpty && !isError">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getBillListByPage"
      >
        <transition-group name="sliceInZoomOut" tag="div">
          <!-- 单个账单 -->
          <div class="bill" v-for="p in billList" :key="p.id">
            <img :src="p.icon" class="icon" />
            <div class="center">
              <span class="name">{{ p.name }}：</span>
              <span class="phone">{{ userInfo.phone | hidePhone }}</span>
              <div class="time">{{ p.time }}</div>
            </div>
            <span :class="p.type === '收入' ? 'amount' : 'amount reduce'">
              {{ p.type === "收入" ? "+" : "-" }}￥{{ p.amount | price }}
            </span>
          </div>
        </transition-group>
      </van-list>
    </div>
    <!-- 网络错误 -->
    <error-card
      v-if="isEmpty || isError"
      @refresh="getBillListByPage"
      :btn-text="isError && !isEmpty ? '刷新' : '返回'"
      :image="isError ? 'network' : 'default'"
      :text="isError ? '网络错误，请稍后重试！' : '还没有交易账单~'"
      class="error"
    />
  </default-page>
</template>
  <script>
import DefaultPage from "@/components/DefaultPage.vue";
import ErrorCard from "@/components/ErrorCard.vue";
import { getBills } from "@/api/user/purse";
import { mapState } from "vuex";
export default {
  components: { DefaultPage, ErrorCard },
  name: "BillsView",
  data() {
    return {
      billList: [],
      nowDate: new Date(),

      // 功能
      isEmpty: false,
      isError: false,
      loading: false,
      finished: false,
      year: 2003,
      mounth: 0,
    };
  },
  created() {
    this.year = this.nowDate.getFullYear();
    this.mounth = this.nowDate.getMonth() + 1;
  },
  methods: {
    // 获取账单
    async getBillListByPage() {
      // this.billList.splice(0);

      const res = await getBills(
        `${this.year}`,
        `${this.mounth}`,
        this.$store.getters.token
      );
      const data = res.data.data || [];

      if (res.data.code === 20011) {
        if (data.length === 0) {
          this.isEmpty = true;
          this.loading = false;
          this.finished = true;
          return;
        } else {
          for (let i = 0; i < data.length; i++) {
            // 处理对应的图标
            data[i].icon = this.getTypeIcon(data[i].name);
            this.billList.push(data[i]);
          }
        }
      } else {
        this.isError = true;
      }

      this.loading = false;
      this.finished = true;
    },
    getTypeIcon(type) {
      switch (type) {
        case "钱包充值":
          type = require("@/assets/image/icon/phonebill.png");
          break;
        case "签到送积分":
          type = require("@/assets/image/icon/coins_icon.png");
          break;
        case "购物消费":
          type = require("@/assets/image/icon/shopbill.png");
          break;
        default:
          type = require("@/assets/image/icon/onShopcar.png");
          break;
      }
      return type;
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>
<style scoped>
.content {
  padding: 0.1rem 0.3rem;
}

.bill {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bg-color6);
  padding: 0.2rem 0.3rem;
}
.bill .icon {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.2rem;
  padding: 0.25rem;
  border-radius: 50%;
  margin-left: 0;
  object-fit: contain;
  background-color: var(--bg-color6);
}
.bill .amount {
  font-weight: 600;
  font-size: 0.45rem;
  padding-bottom: 1em;
  font-family: Helvetica;
}
.bill .center {
  flex: 1;
}
.bill .time {
  color: var(--text-color3);
  font-size: 0.3rem;
}
.reduce {
  color: var(--tip-color2);
}
</style>