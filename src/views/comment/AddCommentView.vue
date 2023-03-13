<template>
  <div class="add-comment-view">
    <!-- 导航 -->
    <top-nav title="评论" class="top-nav" @click-left="$router.back()">
      <template #rblock>
        <!-- 提交评论 -->
        <button class="v-btn submit-btn" @click="submitComment">提交</button>
      </template>
    </top-nav>
    <!-- 评论表单 -->
    <div class="content-froms" v-if="!isError">
      <comment-form
        v-for="p in orderInfo?.orderItems"
        :key="p.orderItemId"
        :goods="p"
        ref="commentForm"
      />
    </div>
    <!-- 错误 -->
    <error-card
      v-if="isError"
      @refresh="$router.back()"
      btn-text="返回"
      image="network"
      text="页面刷新，请重新进入！"
    />
  </div>
</template>
  
  <script>
import TopNav from "@/components/TopNav.vue";
import ErrorCard from "@/components/ErrorCard.vue";
import CommentForm from "@/components/Comment/CommentForm.vue";
import { getOrderById } from "@/api/order/order";
import { checkText } from "@/util/xxsFilter";
import { addOrderComment } from "@/api/comment/ordercomment";
export default {
  components: { TopNav, ErrorCard, CommentForm },
  name: "AddCommentView",
  data() {
    return {
      orderId: "", // 订单id
      orderInfo: "",
      // 功能
      isError: false, // 是否错误
    };
  },
  mounted() {
    // 获取订单id
    if (this.$route.query?.id) {
      this.orderId = this.$route.query?.id;
      this.$toast.loading({
        forbidClick: true,
        message: "加载中...",
        duration: 0,
      });
      getOrderById(this.orderId, this.$store.getters.token).then((res) => {
        if (res.status === 200 && res.data.code === 20011) {
          this.isError = false;
          res.data.data?.orderItems.forEach((p) => {
            p.rate = 0;
          });
          this.orderInfo = res.data.data;
        } else {
          this.isError = true;
        }
      });
    } else {
      this.isError = true;
    }
    this.$toast.clear(true);
  },
  methods: {
    // 提交评论
    submitComment() {
      if (this.isError) return;
      this.$toast.loading({ duration: 0, forbidClick: true });
      // 获取 评论列表
      this.$refs.commentForm.forEach(async (p) => {
        if (p?.content === "") return this.$toast(" 内容不能为空！");
        const res = await addOrderComment(
          p.orderItemId,
          p.rate, // 星级
          p.imgUrl, // 图片集合
          checkText(p?.content), // 内容xxs
          this.$store.getters.token
        );
        if (res.status === 200 && res.data.code === 20011) {
          this.$toast.success(" 提交成功！");
          // 跳转
          this.$router.replace({
            name: "order",
            params: {
              animate: "forward",
              toBack: false,
            },
          });
        } else {
          this.$toast.fail(" 提交失败！");
        }
        // 清空
        setTimeout(() => {
          this.$toast.clear();
        }, 300);
      });
    },
  },
};
</script>
<style scoped>
.add-comment-view {
  background-color: var(--bg-color6);
}
/* 顶部导航 */
.top-nav {
  border-bottom: 1px solid var(--border-color);
  background-color: var(--theme-color);
}
.top-nav .submit-btn {
  width: auto;
  border-radius: 6px;
  padding: 0.05rem 0.15rem;
  padding-left: 0.2rem;
  font-size: 0.3rem;
  text-align: center;
  box-shadow: none;
}
/* 评论列表 */
.content-froms {
  width: 100%;
}
</style>