<template >
  <div class="comment-child-card disable-popup">
    <div class="child-card">
      <!-- 头像 -->
      <img :src="getImgSrc(comment.userIcon)" class="icon left" />
      <!-- 内容 -->
      <div class="contain" v-longpress="onDelete">
        <div class="r-text">
          <small class="text nickname"
            >{{ comment.nickname }}
            <span class="text isAuther" v-if="comment.isAuthor">作者</span>
            <span class="text isAuther" v-if="comment.isMe">自己</span>
          </small>
          <div class="text texts">{{ comment.content }}</div>
          <div>
            <small class="text">{{ initTime(comment.time) }}</small>
            &nbsp;
            <span class="grey text" @click="toComment(comment.id)">回复</span>
          </div>
        </div>
      </div>
      <!-- 喜欢/不 -->
      <div class="right" @click="pickLike(comment.id)">
        <van-icon
          :name="comment?.isLiked ? 'like' : 'like-o'"
          :color="comment?.isLiked ? 'var(--tip-color2)' : 'var(--text-color3)'"
        />
        <div class="like-nums text grey" style="text-align: center">
          {{ comment.liked || "" }}
        </div>
      </div>
    </div>
    <!-- 孙评论 -->
    <slot class="son-card"></slot>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import { addCommentlikedByfid } from "@/api/comment/pickcomment";
export default {
  props: {
    comment: { required: true },
    fid: { required: false },
    first: {
      default: -1,
      required: true,
    },
    second: {
      default: -1,
      required: false,
    },
  },
  methods: {
    // 获取图片地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },

    // 格式日期
    initTime(time) {
      let date = new Date(time);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    },

    // 触发删除
    onDelete() {
      if (this.comment.isMe) {
        this.$emit("deleteComment", this.comment?.id);
      }
    },

    // 点赞
    async pickLike(fid) {
      if (this.pickTimer) return;
      const res = await addCommentlikedByfid(fid, this.$store.state.token);
      if (res.data.success) {
        if (this.comment.isLiked) {
          this.$set(this.comment, "isLiked", false);
          this.$set(this.comment, "liked", this.comment.liked - 1);
          this.$toast("取消点赞");
        } else {
          this.$set(this.comment, "isLiked", true);
          this.$set(this.comment, "liked", this.comment.liked + 1);
        }
      }
    },

    // 切换评论对象
    toComment(id) {
      this.$emit("toComment", {
        fid: id, // 整体评论的主id
        sid: this.fid, // 父id
        name: this.comment.nickname, // 对谁评论
      });
    },
  },
};
</script>
<style scoped>
.child-card {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0.3rem 0;
}
.text {
  font-size: 0.34rem;
}
.grey {
  color: var(--text-color3);
}
.text-small {
  font-size: 0.3rem;
}
.child-card .contain {
  padding: 0 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.child-card .r-text {
  width: 100%;
}
.r-text > div {
  padding: 0.06rem 0;
}

.child-card .icon,
.icon .icon-small {
  width: 1rem;
  height: 1rem;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}
.icon-small {
  width: 0.6rem;
  height: 0.6rem;
}
.isAuther {
  width: 3em;
  display: inline-block;
  background-color: var(--border-color);
  font-size: 0.3rem;
  border-radius: 0.2rem;
  text-align: center;
}

/* 子评论 */
.comment-child-card > .son-card {
  opacity: 0.8;
  padding-left: 1rem;
}
.comment-child-card > .son-card .icon {
  width: 0.6rem;
  height: 0.6rem;
}
</style>
 