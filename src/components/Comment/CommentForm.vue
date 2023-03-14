<template>
  <div class="v-card comment-form">
    <div class="title">您对该商品满意吗？</div>
    <div class="goods" style="display: flex; align-items: center">
      <img :src="getImgSrc(goods?.image)" />
      <div class="names">{{ goods?.goodsName }}</div>
    </div>
    <!-- 星级 -->
    <div class="stars" style="display: flex; align-items: center">
      总体&emsp;
      <van-rate
        v-model="rate"
        color="var(--theme-color2)"
        void-icon="star"
        void-color="#eee"
        size="0.6rem"
      />
      &emsp;{{ rateText }}
    </div>
    <!-- 内容 -->
    <transition name="item">
      <div class="comment-content" v-show="rate > 0">
        <van-field
          class="comment-texts"
          v-model="content"
          rows="5"
          maxlength="240"
          type="textarea"
          placeholder="✍ 说说感觉怎么样，给大家参考"
        />
        <!-- 图片上传 -->
        <van-uploader
          v-model="imgList"
          :upload-icon="require('@/assets/image/icon/camera.png')"
          multiple
          :max-size="720 * 1024"
          @oversize="overSizeFile"
          accept="image/png, image/jpeg, image/jpg,image/*"
          class="upload"
        />
      </div>
    </transition>
  </div>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import { uploadOrderImgById } from "@/api/comment/ordercomment";
export default {
  name: "CommentForm",
  props: ["goods"],
  data() {
    return {
      orderItemId: 0, // 属性id
      rate: 0, // 星级
      rateText: "", // 评分等级
      content: "", // 文字内容
      imgUrl: "", // 上传的图片字符集合

      imgList: [], // 上传图片集合
    };
  },
  mounted() {
    // 属性id
    this.orderItemId = this.goods.orderItemId;
  },
  methods: {
    // 上传图片
    async uploadImg() {
      const formData = new FormData();
      for (let i = 0; i < this.imgList.length; i++) {
        formData.append("files", this.imgList[i].file, this.imgList[i].name);
      }

      const fileRes = await uploadOrderImgById(
        this.goods?.orderItemId,
        formData,
        this.$store.getters.token
      );

      // 失败
      if (fileRes.status !== 200 || fileRes.data.code !== 20011) {
        return this.$toast({ type: "fail", message: "上传失败！" });
        // 成功
      } else {
        this.imgUrl = fileRes.data.data;
      }
    },

    // 文件大小
    overSizeFile() {
      this.$toast(`大小不能超过720P！`);
    },

    // img地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },

    // 评分等级文字
    changeRate(val) {
      switch (+val) {
        case 1:
          this.rateText = "非常差";
          break;
        case 2:
          this.rateText = "较差";
          break;
        case 3:
          this.rateText = "一般";
          break;
        case 4:
          this.rateText = "满意";
          break;
        case 5:
          this.rateText = "非常满意";
          break;
      }
    },
  },
  watch: {
    imgList: {
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.uploadImg(); // 上传图片，请求图片地址
        } else {
          this.imgUrl = ""; // 清空图片
        }
      },
    },
  },
};
</script>
<style scoped>
.add-comment-view .v-card {
  border-radius: 8px;
}
.comment-form {
  margin: 0.2rem 0.3rem;
  background-color: var(--theme-color);
}
.comment-form .title {
  font-weight: 600;
}
.goods {
  margin: 0.5rem 0;
}
.goods img {
  display: block;
  width: 1.4rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-right: 0.3rem;
}
.goods .names {
  font-size: 0.36rem;
  letter-spacing: 0.04rem;
}
/* stars */
.stars {
  font-size: 0.36rem;
}
/* comment-texts */
.comment-content >>> .van-field {
  padding: 0;
  background-color: transparent;
}
.comment-content {
  width: 100%;
  background-color: var(--bg-color6);
  margin-top: 0.3rem;
  padding: 0.3rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.comment-content >>> .van-uploader__upload,
.comment-content >>> .van-uploader__preview-image,
.comment-content >>> .van-uploader__preview {
  background-color: var(--bg-color5);
  border-radius: 6px;
  width: 1.8rem;
  height: 1.8rem;
  margin: 0;
}
.comment-content >>> .van-uploader__preview >>> .van-icon__image {
  width: 1rem;
  height: 1rem;
  opacity: 0.2;
  margin: 0;
}
.comment-content >>> .van-uploader__preview {
  margin-right: 0.2rem;
}
</style>