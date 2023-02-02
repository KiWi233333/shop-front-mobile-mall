<template>
  <div class="top-nav">
    <!-- 顶部导航 -->
    <van-icon
      @click="$router.back()"
      name="arrow-left"
      class="icon"
      size="0.6rem"
    />
    <div class="right">
      <van-icon @click="toView(1)" name="search" class="icon" size="0.6rem" />
      <van-icon
        @click="showShare = true"
        name="ellipsis"
        class="icon"
        size="0.6rem"
      />
    </div>
    <!-- 分享页面 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
    <!-- 二维码页面 -->
    <van-dialog v-model="showDialog" title="邀你，扫一扫！">
      <div class="qrcode" ref="qecodeImg"></div>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import QRCode from "qrcodejs2";
export default {
  name: "ShareNav",
  data() {
    return {
      // 分享面板
      showShare: false,
      showDialog: false,
      sqrcode: "",
      options: [
        { name: "微信", icon: "wechat" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
    };
  },
  methods: {
    // 页面跳转
    toView(i) {
      switch (i) {
        // 前往搜索页面
        case 1:
          this.$router.push({
            name: "search",
            params: { animate: "forward" },
          });
          break;
      }
    },

    // 分享面板选择
    onSelect(p) {
      switch (p.icon) {
        case "qrcode":
          this.showDialog = true;
          this.$nextTick(() => {
            if (this.sqrcode === "") {
              this.sqrcode = new QRCode(this.$refs.qecodeImg, {
                text: location.href, // 需要转换为二维码的内容
                correctLevel: QRCode.CorrectLevel.H,
              });
            }
          });
          break;

        default:
          if (!navigator.clipboard) return;
          navigator.clipboard
            .writeText(location.href)
            .then(() => {
              Dialog({
                title: " 复制成功！",
                message: location.href,
              });
            })
            .catch(() => {
              Toast(" 用户取消了复制！");
              Dialog({
                title: " 请手动复制进行分享！",
                message: location.href,
              });
            });
          break;
      }
      this.showShare = false;
    },
  },
};
</script>
<style scoped>
/* 顶部导航 */
.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
}
.top-nav .icon {
  padding: 0.14rem;
  transition: 0.3s;
  border-radius: 4px;
}
.top-nav .icon:hover,
.top-nav .icon:active {
  background-color: var(--bg-color3);
  transform: scale(0.85);
}

/* 二维码 */
.van-dialog {
  width: 65%;
}
.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
}
.qrcode >>> img {
  margin-top: 20px;
  width: 70%;
  height: 70%;
}
</style>