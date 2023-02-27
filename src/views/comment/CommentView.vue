<template>
  <default-page
    :title="`评论${commentLength ? ' (' + commentLength + ')' : ''}`"
  >
    <van-tabs
      v-model="activeBar"
      sticky
      animated
      lazy-render
      swipeable
      color="var(--theme-color2)"
      title-active-color="var(--theme-color2)"
      @change="changeNav"
    >
      <van-tab
        v-for="(p, i) in option"
        class="top-nav"
        :key="i"
        :title="p.title"
        :name="p.name"
      >
        <comment-list :reqType="p.sort" :gid="goodId" />
      </van-tab>
    </van-tabs>
    <!-- 评论弹窗 -->
    <comment-popup />
  </default-page>
</template>
  
  <script>
import CommentList from "@/components/Comment/CommentList.vue";
import DefaultPage from "@/components/DefaultPage.vue";
import CommentPopup from "@/components/Comment/CommentPopup.vue";
export default {
  name: "CommentView",
  components: { DefaultPage, CommentList, CommentPopup },
  data() {
    return {
      goodId: "",
      activeBar: 0,
      option: [
        { name: "0", title: "综合", sort: 0 },
        { name: "1", title: "最新", sort: 1 },
      ],
      commentLength: 0,
    };
  },
  mounted() {
    // 获取商品id
    if (this.$route.query?.id) {
      this.goodId = this.$route.query?.id;
    }
    if (this.$route.query?.size) {
      this.commentLength = this.$route.query.size || 0;
    }
  },
  methods: {
    changeNav() {
      console.log();
    },
  },
};
</script>
<style scpoed>
.top-nav {
  display: flex;
}
</style>