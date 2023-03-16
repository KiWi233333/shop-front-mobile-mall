<template>
  <default-page title="账单详情">
    <div class="BillsDetailView" v-show="!isEmpty && !isError">
      <!-- 单个账单 -->
      <div class="bill" v-for="p in billList" :key="p.id">
        <img :src="p.icon" class="icon" />
        <div class="center">
          <span class="name">{{ p.name }}:</span>
          <span class="phone">{{ userInfo.phone | hidePhone }}</span>
          <div class="time">{{ p.time }}</div>
        </div>
        <span :class="p.type === '收入' ? 'amount' : 'amount reduce'">
          {{ p.type === "收入" ? "+" : "-" }}￥{{ p.amount | price }}
        </span>
      </div>
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
    };
  },
  methods: {},
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
}
.bill .icon {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.2rem;
  padding: 0.25rem;
  border-radius: 50%;
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
}
.reduce {
  color: var(--tip-color2);
}
</style>