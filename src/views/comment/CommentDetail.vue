<template>
  <default-page title="评价详情">
    <comment-card :comment="comment" :disableComment="true" class="author" />
    <div class="comment-box" @mousedown="blurCommentObj">
      <div style="text-align: center">{{ comment_child.length }} 条回复</div>
      <!-- 评论 -->
      <transition-group tag="div" name="bottomRight">
        <comment-child-card
          @deleteComment="deleteComment"
          @toComment="changeCommentObj"
          v-for="(p, i) in comment_child"
          :comment="p"
          :key="p.id"
          :first="i"
        >
          <template>
            <!-- 子评论 -->
            <div class="son-card">
              <transition-group tag="div" name="bottomRight">
                <comment-child-card
                  v-for="(son, j) in p.childComments"
                  :comment="son"
                  @deleteComment="deleteComment"
                  @toComment="changeCommentObj"
                  :key="son.id"
                  :fid="p?.id"
                  :first="i"
                  :second="j"
                ></comment-child-card>
              </transition-group>
            </div>
          </template>
        </comment-child-card>
      </transition-group>
    </div>

    <!-- 评论输入 -->
    <div class="to-comment">
      <van-image
        lazy-load
        round
        :src="getImgSrc(comment?.userIcon)"
        class="user-icon"
      />
      <van-field
        class="v-input"
        type="text"
        v-model="commentText"
        :formatter="formatInput"
        :placeholder="getHiddentText || '买家期待和你交流~'"
        ref="commentInput"
      ></van-field>
      <input type="submit" value="发送" class="v-btn" @click="addComment" />
    </div>
  </default-page>
</template>

<script>
import {
  addCommentChild,
  deleteCommentByfid,
  getCommentSons,
} from "@/api/comment/pickcomment";
import DefaultPage from "@/components/DefaultPage.vue";
import CommentCard from "@/components/Comment/CommentCard.vue";
import CommentChildCard from "@/components/Comment/CommentChildCard.vue";
import { getResourImageByName } from "@/api/res";
import { checkText } from "@/util/xxsFilter";
export default {
  name: "CommentDetail",
  components: { DefaultPage, CommentCard, CommentChildCard },
  data() {
    return {
      commentText: "",
      index: { first: -1, second: -1 }, // 数组坐标
      commentId: "",
      fid: "",
      sid: "",
      commentNickName: "",
      comment: {}, // 评论
      comment_child: [], // 子评论
      timer: "",
    };
  },
  mounted() {
    // 获取祖评论
    if (this.$route.params?.comment) {
      this.comment = this.$route.params?.comment;
      sessionStorage.setItem("THE_COMMENT", JSON.stringify(this.comment));
    } else {
      this.comment = JSON.parse(sessionStorage.getItem("THE_COMMENT"));
    }
    if (this.$route.query.id) {
      // 评论的id
      this.commentId = this.$route.query?.id;
      // 获取评论父评论 和 孙元素
      this.reqGetItem();
    }
  },
  methods: {
    // 获取评论子评论
    async reqGetItem() {
      const res = await getCommentSons(
        this.$route?.query.id,
        this.$store.getters.token
      );
      if (res.status === 200 && res.data.code === 20011) {
        console.log(res.data);
        this.comment_child.splice(0); // 清空
        res.data.data.forEach((p) => {
          this.comment_child.push(p);
        });
      }
    },

    // 改变评论对象
    changeCommentObj(obj) {
      this.fid = obj?.fid;
      this.sid = obj?.sid;
      console.log(this.fid);
      this.commentNickName = obj.name;
      this.$refs.commentInput.$refs.input.focus();
    },

    // 失去焦点清空对象
    blurCommentObj() {
      this.fid = null;
      this.commentNickName = "";
    },

    // 去评论
    async addComment() {
      if (this.commentText.trim() === "")
        return this.$toast("评论内容不能为空！");
      console.log(this.commentId, this.fid);
      const res = await addCommentChild(
        this.commentId,
        this.fid,
        this.commentText,
        this.$store.getters.token
      );
      this.commentText = "";
      if (res.data.code === 20011 && res.status === 200) {
        // 重新获取评论
        this.reqGetItem();
        console.log(res.data);
        this.$toast("评论成功！");
      } else {
        this.$toast("评论失败！");
      }
    },

    // 删除评论
    async deleteComment(id) {
      this.$dialog
        .confirm({
          title: "是否删除该评论？",
          beforeClose: async (action, done) => {
            if (action === "confirm") {
              const res = await deleteCommentByfid(
                id,
                this.$store.getters.token
              );
              if (res.data.code === 20011 && res.status === 200) {
                console.log(res.data);
                this.$toast("删除成功！");
                this.reqGetItem(); // 重新获取评论
              } else {
                this.$toast("删除失败！");
              }
            }
            done();
          },
        })
        .catch(() => {});
    },

    touchStart(fn) {
      clearTimeout(this.timer);
      this.timer = setTimeout(fn, 800);
    },

    touchEnd() {
      clearTimeout(this.timer);
    },

    // 格式化用户输入
    formatInput(val) {
      return checkText(val.trim());
    },

    // 图片地址
    getImgSrc() {
      return getResourImageByName(this.$store.state.userInfo.icon);
    },
  },
  computed: {
    // 计算输入框的默认对象
    getHiddentText() {
      if (this.commentNickName) {
        return `对 ${this.commentNickName} 回复`;
      } else {
        return "";
      }
    },
  },
};
</script>
<style scoped>
.author {
  padding: 0.2rem;
}
/* 评论区 */
.comment-box {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 2px #dddddd71;
  padding: 0.4rem;
  background-color: var(--theme-color);
  width: 100vw;
  position: absolute;
  left: 0;
  padding-bottom: 2rem;
}

/* 评论栏 */
.to-comment {
  padding: 0 0.2rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--theme-color);
  /* box-shadow: var(--shadow-color2); */
  border-top: 1px solid var(--border-color);
}
.to-comment .user-icon {
  width: 1rem;
  height: 1rem;
}
.to-comment .v-input {
  background-color: var(--bg-color5);
}
.to-comment .v-input {
  flex: 1;
  margin: 0 0.2rem;
  padding: 0.16rem 0.4rem;
}
.to-comment .v-btn {
  padding: 0.16rem 0.5rem;
  border: none;
}
</style>