<template>
  <default-page title="账单">
    <div class="Bills-view" v-show="!isEmpty && !isError">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getBillListByPage"
      >
        <div class="bills-list" v-for="(m, i) in mounthList" :key="i">
          <div class="top-info">
            <div class="year-mounth">{{ m.year }}年{{ m.mounth }}月</div>
            <span class="all-out">支出:￥{{ m.allOut | price }}</span>
            <span class="all-in">&emsp;收入:￥{{ m.allIn | price }}</span>
          </div>
          <!-- 单个账单 -->
          <div
            class="bill"
            v-for="p in billList"
            :key="p.id"
            @click="toDetailView(p)"
          >
            <img :src="p.icon" class="icon" />
            <div class="center">
              <span class="name">{{ p.name }}：</span>
              <span class="phone">{{ userInfo.phone | hidePhone }}</span>
              <div class="time">{{ p.time }}</div>
            </div>
            <span :class="p.type === '收入' ? 'amount add' : 'amount '">
              {{ p.type === "收入" ? "+" : "-" }}{{ p.monetaryUnit ? "" : "￥"
              }}{{ p.amount | price }}
            </span>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 网络错误 -->
    <error-card
      v-if="isEmpty || isError"
      @refresh="isError ? getBillListByPage : $router.back()"
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
      mounthList: [], // 有数据的月份
      billList: [],
      nowDate: new Date(),

      // 功能
      isEmpty: false,
      isError: false,
      loading: false,
      finished: false,
      year: 2023,
      mounth: 0,

      // 月份倒数总月份
      mounthRes: 0,
    };
  },
  created() {
    this.year = this.nowDate.getFullYear();
    this.mounth = this.nowDate.getMonth() + 1;
    // 2000年至今的数据
    this.mounthRes = this.year * 12 + this.mounth; // 总月份
  },
  methods: {
    // 获取账单
    async getBillListByPage() {
      const res = await getBills(
        `${this.year}`,
        `${this.mounth}`,
        this.$store.getters.token
      );
      const data = res.data.data || [];
      if (res.data.code === 20011) {
        if (data.length === 0) {
          this.loading = false;
          this.finished = true;
          if (this.mounth === this.nowDate.getMonth() + 1) {
            this.isEmpty = true;
          }
          return;
        }
        if (data.length !== 0) {
          let allIn = 0;
          let allOut = 0;
          // 遍历数据
          for (let i = 0; i < data.length; i++) {
            // 处理对应的图标
            data[i].icon = this.getTypeIcon(data[i].name, data[i]);
            // 总支出收入
            if (data[i].type === "收入") {
              allIn += data[i].amount;
            } else {
              allOut += data[i].amount;
            }
            this.billList.push(data[i]);
          }
          // 月份统计
          this.mounthList.push({
            allIn,
            allOut,
            year: Math.floor(this.mounthRes / 12),
            mounth: this.mounth,
          });
          if (this.mounth === 1) {
            this.mounthRes -= 12; // 去掉一年
            this.mounth = 12;
          } else {
            this.mounth--;
          }
          this.loading = false;
        }
      } else {
        this.isError = true;
      }
      this.loading = false;
    },

    // 去到详情页面
    toDetailView(bill) {
      this.$router.push({
        name: "billsdetail",
        params: {
          animate: "forward",
          bill,
        },
      });
    },

    // 获取icon类型
    getTypeIcon(type, p) {
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
      if (p?.monetaryUnit == "积分") {
        p.name = "积分获取";
        type = require("@/assets/image/icon/coins_icon.png");
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
/* 每项顶部月份栏目 */
.top-info {
  padding: 0.2rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.top-info .year-mounth {
  font-weight: 600;
  font-size: 0.5rem;
  margin-bottom: 0.2rem;
}
.top-info .all-out,
.top-info .all-in {
  font-size: 0.36rem;
  color: var(--text-color3);
}
.bill {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bg-color6);
  padding: 0.2rem;
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
  font-family: Helvetica;
}
.bill .center {
  flex: 1;
}
.bill .time {
  color: var(--text-color3);
  font-size: 0.3rem;
}
.add {
  color: var(--tip-color2);
}
</style>