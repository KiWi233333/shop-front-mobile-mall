<template>
  <div class="v-card notice-bar">
    <van-icon
      class="icon"
      name="hot-o"
      color="var(--tip-color2)"
      size="0.6rem"
    />
    <span class="content">{{ notice?.content }} </span>
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
  margin: 0.2rem 0;
  padding: 0.2rem 0.3rem;
  border-radius: 10px;
}
.content {
  padding-left: 0.2rem;
  font-size: 0.3rem;
}
</style>
