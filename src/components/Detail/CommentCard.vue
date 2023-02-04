<template>
  <div class="comment-card comments" v-show="comment">
    <!-- 头像时间 -->
    <div class="lable-group">
      <div class="lable top">
        <van-image
          lazy-load
          round
          :src="getImgSrc(comment?.userIcon)"
          class="icon"
        />
        <div class="name">{{ comment?.nickname }}</div>
        <van-tag plain color="var(--tip-color2)" v-if="!comment?.isMe"
          >我的评价</van-tag
        >
      </div>
      <div class="lable">{{ comment?.time }}</div>
    </div>
    <div class="lable contents">{{ comment?.content }}</div>
    <!-- 评论照片 -->
    <div class="good-imgs" v-if="comment?.images">
      <van-image
        lazy-load
        class="img"
        fit="cover"
        v-for="(src, i) in comment?.images"
        :key="i"
        :src="getImgSrc(src)"
        @click="showPreImg(comment?.images, i)"
      />
    </div>
    <!-- 点赞留言 -->
    <div class="lable-group tips">
      <div class="lable">
        评分：<van-rate v-model="stars" readonly size="0.4rem" gutter="0" />
      </div>
      <div class="lable">
        <div class="left" @click="addCommentPick">
          <!-- 喜欢 -->
          <van-icon
            name="like"
            color="var(--tip-color2)"
            v-show="comment?.isLiked"
          />
          <!-- 未喜欢 -->
          <van-icon name="like-o" v-show="!comment?.isLiked" />
          <span class="text">{{ comment?.liked || "赞" }}</span>
        </div>
        <div class="right" @click="toView">
          <van-icon name="comment-o" />
          <span class="text">{{ comment?.comment || "" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCommentLiked } from "@/api/comment/comment";
import { getResourImageByName } from "@/api/res";
import { ImagePreview, Toast } from "vant";
export default {
  props: {
    comment: {
      type: Object,
      default() {
        return {
          stars: 0,
        };
      },
    },
  },
  name: "CommentCard",
  data() {
    return {
      pickTimer: "",
      stars: 0,
    };
  },
  watch: {
    "comment.stars": {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.stars = newVal;
      },
    },
  },
  methods: {
    // 展示图片预览
    async showPreImg(imgs, i) {
      const images = JSON.parse(JSON.stringify(imgs));
      // 修改
      await images.forEach((p, i) => {
        images[i] = this.getImgSrc(p);
      });
      // 图片预览
      ImagePreview({ images, closeable: true, startPosition: i });
    },

    // 添加评论点赞
    async addCommentPick() {
      if (this.pickTimer) return;
      const res = await addCommentLiked(
        this.comment.id,
        this.$store.state.token
      );
      if (res.data.success) {
        if (res.data?.data) {
          Toast("取消点赞");
          this.$emit("setIsLike", false);
        } else {
          this.$emit("setIsLike", true);
        }
      }
    },

    // toView
    toView() {
      this.$router.push({
        name: "commentdetail",
        params: { animate: "forward" },
      });
    },

    // 获取图片地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
};
</script>

<style>
/* 评论 */
.comments {
  display: flex;
  flex-direction: column;
}

.comments .top .icon {
  width: 1rem;
  height: 1rem;
}
.comments .top .name {
  float: left;
  padding: 0 0.2rem;
  color: var(--theme-color4);
}
.comments .contents {
  display: block;
  transition: 0.2s;
  max-height: 6em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.good-imgs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
}
.good-imgs .img {
  display: block;
  width: 2rem;
  height: 2rem;
  margin: 0.2rem 0;
  margin-right: 0.3rem;
  border-radius: 8px;
  object-fit: cover;
  overflow: hidden;
}
.tips {
  cursor: pointer;
  color: var(--text-color4);
  padding: 0.1rem 0.2rem;
}
.tips .lable {
  color: var(--text-color4);
}
.tips .lable div {
  padding: 0 0.1rem;
}
.tips .lable .text {
  font-size: 0.36rem;
  padding: 0 0.1rem;
}
</style>