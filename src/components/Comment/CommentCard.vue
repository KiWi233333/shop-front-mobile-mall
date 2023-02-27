<template>
  <div class="comment-card comments" v-show="comment">
    <!-- 头像时间 -->
    <div class="lable-group" @click="!disableComment ? toCommentView() : ''">
      <div class="lable top">
        <van-image
          lazy-load
          round
          :src="getImgSrc(comment?.userIcon)"
          class="icon"
        />
        <div class="name">{{ comment?.nickname }}</div>
        <van-tag plain color="var(--tip-color2)" v-if="comment?.isMe"
          >我的评价</van-tag
        >
      </div>
      <div class="lable">{{ comment?.time }}</div>
    </div>
    <div class="lable contents" @click="!disableComment ? toCommentView() : ''">
      {{ comment?.content }}
    </div>
    <!-- 评论照片 -->
    <div
      class="good-imgs"
      @click="!disableComment ? toCommentView() : ''"
      v-if="comment?.images"
    >
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
            :name="comment?.isLiked ? 'like' : 'like-o'"
            :color="
              comment?.isLiked ? 'var(--tip-color2)' : 'var(--text-color3)'
            "
          />
          <span class="text">{{ comment?.liked || "赞" }}</span>
        </div>
        <!-- 评论 -->
        <div class="right" @click="changeCommentPopup" v-if="!disableComment">
          <van-icon name="comment-o" />
          <span class="text">{{ comment?.comment || "评论" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCommentLiked } from "@/api/comment/comment";
import { getResourImageByName } from "@/api/res";
import { ImagePreview } from "vant";
import { mapState } from "vuex";
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
    disableComment: {
      required: false,
      default: false,
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
    // 展示评论
    changeCommentPopup() {
      this.$store.commit("setShowCommentPopup", {
        show: true,
        commentId: this.comment.id,
      });
    },

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

    // 修改评论点赞
    async addCommentPick() {
      if (this.pickTimer) return;
      const res = await addCommentLiked(
        this.comment.id,
        this.$store.state.token
      );
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

    // toCommentView
    toCommentView() {
      this.$router.push({
        name: "commentdetail",
        query: { id: this.comment.id },
        params: { animate: "forward", comment: this.comment },
      });
    },

    // 获取图片地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
  computed: {
    ...mapState(["showCommentPopup"]),
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
  font-size: 0.3rem;
  padding: 0 0.1rem;
  vertical-align: auto;
}
</style>