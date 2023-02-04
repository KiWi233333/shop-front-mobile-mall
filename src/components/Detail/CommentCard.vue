<template>
  <div class="comment-card comments" v-show="comment">
    <div class="lable-group">
      <div class="lable top">
        <van-image
          lazy-load
          round
          :src="getImgSrc(comment?.userIcon)"
          class="icon"
        />
        <div class="name">{{ comment?.nickname }}</div>
      </div>
      <div class="lable">{{ comment?.time }}</div>
    </div>
    <div class="lable contents">{{ comment?.content }}</div>
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
    <div class="lable-group">
      <div class="lable"></div>
      <div class="lable"></div>
    </div>
  </div>
</template>

<script>
import { getResourImageByName } from "@/api/res";
import { ImagePreview } from "vant";
export default {
  props: ["comment"],
  name: "CommentCard",
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
</style>