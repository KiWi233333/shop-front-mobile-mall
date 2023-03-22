<template>
  <default-page title="账单详情">
    <div class="BillsDetailView">
      <div class="top">
        <img :src="bill?.icon" class="img" />
        <div class="tips">{{ bill?.name }}</div>
        <span :class="bill?.type === '收入' ? 'amount add' : 'amount '">
          {{ bill?.type === "收入" ? "+" : "-"
          }}{{ bill?.monetaryUnit ? " " : "￥" }}{{ bill?.amount | price }}
        </span>
      </div>

      <!-- 状态信息 -->
      <van-cell-group inset class="group">
        <van-cell title="当前状态：" :value="bill?.status" />
        <van-cell title="收付款：" :value="bill?.type" />
        <van-cell title="商户名：" :value="bill?.merchantName" />
        <van-cell title="交易时间" :value="bill?.time" />
        <van-cell
          class="bill-id"
          @click="copyId(`${bill?.id}`)"
          title="交易单号："
          :value="`${bill?.id}`"
        />
        <van-cell title="交易说明：" :value="bill?.remark || '未填写'" />
      </van-cell-group>
    </div>
  </default-page>
</template>
  <script>
import DefaultPage from "@/components/DefaultPage.vue";
import { mapState } from "vuex";
import { copyTextAsync } from "@/util/copy";
export default {
  components: { DefaultPage },
  name: "BillsDetailView",
  data() {
    return {
      bill: null,
    };
  },
  created() {
    if (this.$route.params.bill) {
      this.bill = this.$route.params?.bill;
      sessionStorage.setItem("theBill", JSON.stringify(this.bill));
    } else {
      this.bill = JSON.parse(sessionStorage.getItem("theBill"));
    }
  },
  methods: {
    // 用户复制
    copyId(text) {
      copyTextAsync(text)
        .then(() => {
          this.$toast({ message: "复制成功！", position: "bottom" });
        })
        .catch(() => {
          this.$toast({ message: "用户取消了复制！", position: "bottom" });
        });
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>
<style scoped>
.top {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem 0;
}
.top .img {
  width: 1.4rem;
  height: 1.4rem;
  margin-bottom: 0.2rem;
}
.top .amount {
  padding: 0.2rem 0;
  font-size: 0.56rem;
  font-weight: 600;
}
.top .tips {
  font-size: 0.4rem;
}
.group {
  padding: 0.2rem 0;
}
.group span,
.group div {
  font-size: 0.32rem;
}
.group >>> .van-cell__title {
  color: var(--text-color3);
  flex: auto;
}
.group >>> .van-cell__value {
  color: var(--text-color4);
  flex: auto;
}
/* bill id */
.bill-id .van-cell__value span {
  text-decoration: underline;
  text-decoration-color: var(--border-color);
}
</style>