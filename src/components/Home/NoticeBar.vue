<template>
  <van-swipe
    class="v-card notice-list"
    :autoplay="4000"
    vertical
    :show-indicators="false"
  >
    <van-swipe-item class="notice-bar">
      <van-icon
        class="icon"
        name="medal"
        color="var(--tip-color2)"
        size="0.6rem"
      />
      <span class="content">{{ mainNotice?.content }} </span>
    </van-swipe-item>
    <van-swipe-item
      class="notice-bar"
      v-for="notice in noticeList"
      :key="notice.id"
    >
      <van-icon
        class="icon"
        name="hot-o"
        color="var(--tip-color2)"
        size="0.6rem"
      />
      <span class="content">{{ notice?.content }} </span>
    </van-swipe-item>
  </van-swipe>
</template>
<script>
import { getIndexNotice, getNoticeByPage } from "@/api/system/notice";
export default {
  name: "NoticeBar",
  data() {
    return {
      noticeList: [], // 公告
      mainNotice: {},
    };
  },
  async created() {
    const resList = await getNoticeByPage(1, 8);
    this.noticeList = resList.data.data?.records;
    const res = await getIndexNotice();
    this.mainNotice = res.data.data;
  },
};
</script>
<style scoped>
.notice-list {
  padding: 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 1rem;
  overflow: hidden;
}
.notice-bar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0rem 0.3rem;
}
.content {
  width: 100%;
  padding-left: 0.2rem;
  font-size: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag {
  font-size: 0.3rem;
  background-color: var(--tip-color2);
  padding: 0.1rem 0.2rem;
  border-radius: 5px;
  color: var(--theme-color);
}
</style>
