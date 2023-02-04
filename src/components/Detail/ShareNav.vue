<template>
  <div class="share-view">
    <div class="top-nav-bak"></div>
    <!-- 导航 -->
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
    </div>
    <!-- 分享 -->
    <div class="share">
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
.top-nav-bak {
  z-index: 10;
  width: 100%;
  height: 1.28rem;
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  background-color: var(--theme-color);
}
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  overflow: visible;
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