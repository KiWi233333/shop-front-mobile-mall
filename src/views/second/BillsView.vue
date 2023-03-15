<template>
  <default-page class="sginin-view" title="账单">
    <div class="Bills-view" v-show="!isEmpty && !isError">
      {{ billList }}
    </div>
    <!-- 网络错误 -->
    <error-card
      v-if="isEmpty || isError"
      @refresh="$router.go(0)"
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
export default {
  components: { DefaultPage, ErrorCard },
  name: "BillsView",
  data() {
    return {
      billList: [],
      // 功能
      isEmpty: false,
      isError: false,
    };
  },
  mounted() {
    // 获取账单
    this.getBillListByPage();
  },
  methods: {
    // 获取账单
    async getBillListByPage() {
      const res = await getBills("2023", "2", this.$store.getters.token);
      console.log(res.data);
      if (res.data.code === 20011) {
        if (res.data.data.length === 0) {
          return (this.isEmpty = true);
        } else {
          this.billList = res.data.data;
        }
      } else {
        this.isError = true;
      }
    },
  },
};
</script>
<style scoped>
.content {
  padding: 0.1rem 0.3rem;
}
</style>