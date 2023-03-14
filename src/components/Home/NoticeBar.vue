<template>
  <div class="notice-bar"></div>
</template>
<script>
import { getIndexNotice } from "@/api/system/notice";
export default {
  name: "NoticeBar",
  data() {
    return {
      noticeList: [], // 公告
      notice: {},
    };
  },
  async created() {
    const res = await getIndexNotice();
    // for (const key in res.data.data) {
    //   this.$set(this.notice, key, res.data.data[key]);
    // }
    this.notice = res.data.data;
  },
  methods: {},
};
</script>
<style scoped>
.notice-bar {
  margin-top: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
