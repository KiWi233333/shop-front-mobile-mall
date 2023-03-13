<template>
  <div class="notice-bar">
    <van-notice-bar scrollable :text="notice?.content" :key="notice?.cid" />
  </div>
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
