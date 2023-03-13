<template>
  <!-- 商品列表 -->
  <van-list
    class="comment-list"
    v-model="loading"
    :error.sync="isHttpError"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <transition-group name="bottomRight" tag="div">
      <!-- 商品卡片 -->
      <comment-card
        :comment="item"
        v-for="(item, i) in commentList"
        :key="item.id"
        class="v-card item"
        @deleteOneOrderComment="deleteOneOrderComment(item.id, i)"
      />
    </transition-group>
  </van-list>
</template>
<script>
import { getGoodCommentById } from "@/api/comment/comment";
import CommentCard from "./CommentCard.vue";
import { delteOrderComment } from "@/api/comment/ordercomment";
export default {
  components: { CommentCard },
  props: {
    reqType: {
      // 请求类型
      type: Number,
      required: false,
      default: 0,
    },
    gid: {
      // 请求类型
      required: true,
    },
  },
  name: "CommentList",
  data() {
    return {
      currentPage: 1, // 当前分页
      commentList: [], // 商品列表
      isHttpError: false, // 网络请求错误
      loading: false, // 加载中
      finished: false, // 完成
    };
  },
  methods: {
    // 加载对应的商品列表
    onLoad() {
      this.reqCommentListBySort();
    },

    // 删除评论
    deleteOneOrderComment(id, index) {
      console.log(id, index);
      this.$dialog
        .confirm({
          title: "是否删除评论？",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await delteOrderComment(
                id,
                this.$store.getters.token
              );
              if (res.data.code === 20011) {
                this.commentList.splice(index, 1); // 删除
                done();
                this.$toast({ type: "success", message: "删除成功" });
              } else {
                this.$toast({ type: "fail", message: "删除失败" });
              }
            }
            done();
          },
        })
        .catch(() => {});
    },

    // 请求评论列表
    reqCommentListBySort() {
      this.loading = true;
      getGoodCommentById(this.gid, this.reqType, this.$store.getters.token)
        .then((res) => {
          // console.log(res.data);
          if (res.data.code === 20011) {
            const data = res.data.data;
            let count = 0;
            let timer = setInterval(() => {
              // 数据全部加载完成
              if (count >= data.length) {
                this.finished = true;
                clearInterval(timer);
                this.timer = "";
                return;
              }
              this.commentList.push(data[count]);
              count++;
              // 加载状态结束
              this.loading = false;
              this.finished = true;
            }, 200);
          } else {
            this.isHttpError = true;
          }
        })
        .catch(() => {
          this.isHttpError = true;
        });
    },

    // 重新加载
    reStart() {
      this.currentPage = 1;
      this.commentList.splice(0); // 清空数组
      this.onLoad();
    },
  },
};
</script>
<style scoped>
.item {
  border-radius: 10px;
  margin: 0.2rem 0.1rem;
  box-shadow: var(--shadow-color3);
  padding: 0.2rem 0.3rem;
}
</style>