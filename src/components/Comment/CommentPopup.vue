<template>
  <div class="comment-popup">
    <van-popup
      v-model="showPopup"
      position="bottom"
      round
      :style="{ width: '100%', height: '70%' }"
    >
      <div class="comment-box">
        <div style="text-align: center">{{ commentLength }} 条回复</div>
        <!-- 评论 -->
        <transition-group tag="div" :name="isAnimate ? 'sliceInZoomOut' : ''">
          <comment-child-card
            @deleteComment="deleteComment"
            @toComment="changeCommentObj"
            v-for="(p, i) in comment_child"
            :comment="p"
            :key="p.id"
            :id="p.id"
            :first="i"
          >
            <template>
              <!-- 子评论 -->
              <div class="son-card">
                <transition-group tag="div" name="sliceInZoomOut">
                  <comment-child-card
                    v-for="(son, j) in p.childComments"
                    :comment="son"
                    @deleteComment="deleteComment"
                    @toComment="changeCommentObj"
                    :key="son.id"
                    :id="p.id"
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
      <div
        class="to-comment"
        ref="toCommentBar"
        @touchend="clearCommentObj"
        @mouseleave="clearCommentObj"
      >
        <van-image
          lazy-load
          round
          :src="getImgSrc($store.userInfo?.userIcon)"
          class="user-icon"
        />
        <van-field
          class="v-input"
          type="text"
          v-model="commentText"
          :formatter="formatInput"
          :placeholder="placeText || '买家期待和你交流'"
          ref="commentInput"
          :clearable="true"
          @keyup.enter="addComment"
        ></van-field>
        <input type="submit" value="发送" class="v-btn" @click="addComment" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  addCommentChild,
  deleteCommentByfid,
  getCommentSons,
} from "@/api/comment/pickcomment";
import CommentChildCard from "@/components/Comment/CommentChildCard.vue";
import { getResourImageByName } from "@/api/res";
import { checkText } from "@/util/xxsFilter";
import { mapState } from "vuex";
export default {
  name: "CommentDetail",
  components: { CommentChildCard },
  data() {
    return {
      commentText: "",
      placeText: "", // 虚字
      fid: "",
      sid: "",

      commentLength: 0, // 评论总条数
      // 级别坐标
      firstIndex: -1,
      secondIndex: -1,

      commentNickName: "",
      comment_child: [], // 子评论

      // 功能
      showPopup: false,
      isAnimate: false, // 控制动画
    };
  },
  mounted() {
    this.showPopup = this.showCommentPopup;
  },
  methods: {
    // 获取评论子评论
    async reqGetItem() {
      this.clearCommentObj(); // 清空状态
      const res = await getCommentSons(
        this.commentId,
        this.$store.getters.token
      );
      if (res.status === 200 && res.data.code === 20011) {
        this.comment_child.splice(0); // 清空
        this.commentLength = 0;
        this.commentLength += res.data.data.length;
        res.data.data.forEach((p) => {
          this.comment_child.push(p);
          if (!p?.childComments) return;
          p?.childComments.filter((item) => {
            this.commentLength++;
            item.content.replace(
              /^@:$/,
              `<span style='color:var(--bg-color2);'>@${item.content}:233</span>`
            );
            return item;
          });
        });
      }
    },

    // 去评论
    async addComment() {
      if (this.commentText.trim() === "")
        return this.$toast("评论内容不能为空！");
      const res = await addCommentChild(
        this.commentId,
        this.fid,
        this.commentText.trim(),
        this.$store.getters.token
      );
      this.commentText = "";
      if (res.data.code === 20011 && res.status === 200) {
        // 重新获取评论
        this.reqGetItem();
        this.$toast("评论成功！");
      } else {
        this.$toast("评论失败！");
      }
      this.clearCommentObj(); // 清空状态
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
      // beforeClose:
    },
    // 格式化用户输入
    formatInput(val) {
      return checkText(val);
    },

    // 图片地址
    getImgSrc() {
      return getResourImageByName(this.$store.state.userInfo.icon);
    },

    // 改变评论对象
    changeCommentObj(obj) {
      let { fid, sid, firstIndex, secondIndex } = obj;
      // console.log(obj);
      this.fid = fid;
      this.sid = sid;
      this.firstIndex = firstIndex;
      this.secondIndex = secondIndex;
      this.commentNickName = obj.name;
      this.$refs.commentInput.$refs.input.focus();
    },

    // 清空评论的对象
    clearCommentObj() {
      this.firstIndex = -1;
      this.secondIndex = -1;
      this.fid = null;
      this.commentNickName = "";
    },
  },
  computed: {
    ...mapState(["showCommentPopup", "commentId"]),
  },
  watch: {
    // 评论对象
    firstIndex() {
      if (this.commentNickName && this.firstIndex >= 0) {
        if (this.commentNickName === this.$store.state.userInfo?.nickname) {
          this.placeText = "@自己";
        } else {
          this.placeText = `@${this.commentNickName}`;
        }
      } else {
        this.placeText = "";
      }
    },
    // 评论对象
    secondIndex() {
      if (this.commentNickName && this.secondIndex >= 0) {
        if (this.commentNickName === this.$store.state.userInfo?.nickname) {
          this.commentText = "@自己:";
        } else {
          this.commentText = `@${this.commentNickName}:`;
        }
      } else {
        this.commentText = "";
      }
    },
    // 评论id
    commentId(newVal, oldVal) {
      if (newVal !== oldVal && newVal !== undefined) {
        this.reqGetItem();
      }
    },
    // 监听面板
    showCommentPopup(val) {
      this.showPopup = val;
    },
    // 监听面板
    showPopup(val) {
      this.$store.commit("setShowCommentPopup", {
        show: val,
        commentId: this.commentId,
      });
      if (val) {
        this.reqGetItem();
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