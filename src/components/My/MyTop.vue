<template>
  <div>
    <div class="my-top">
      <div class="left" v-if="isLoginState" @click="showIconPanel = true">
        <van-image
          class="img"
          round
          v-show="userInfo.icon"
          :src="getImage(userInfo.icon)"
          lazy-load
        />
        <img
          v-show="!userInfo.icon"
          src="@/assets/image/icon/camera.png"
          class="img"
        />
      </div>
      <!-- 昵称 -->
      <div class="left" v-else>
        <label class="title2">欢迎您！</label>
        <span>期待你的每次到来~</span>
        <button class="v-btn tolg-btn" @click="toLoginPage">立即登录</button>
      </div>
      <div class="right" v-if="isLoginState">
        <label class="title" @click="toView('userinfo')">{{
          userInfo?.nickname
        }}</label>
        <span class="userid" @click="copyID(userInfo.username)"
          >ID:{{ userInfo?.username }}</span
        >
      </div>
      <img src="@/assets/image/bg/shopcard_bg.png" class="bg" />
      <button
        class="v-btn v-cancel signin"
        @click="toView('signin')"
        v-if="isLoginState"
      >
        签到
      </button>
    </div>
    <!-- 修改头像 -->
    <change-icon v-model="showIconPanel" />
  </div>
</template>
  
  <script>
import { getResourImageByName } from "@/api/res";
import router from "@/router";
import { mapState } from "vuex";
import { Toast } from "vant";
import ChangeIcon from "./ChangeIcon.vue";
import { copyTextAsync } from "@/util/copy";
export default {
  name: "MyTop",
  data() {
    return { showIconPanel: false };
  },
  methods: {
    // 返回静态资源地址
    getImage(url) {
      return getResourImageByName(url);
    },
    // 去登录
    toView(name) {
      router.push({
        name,
        params: {
          animate: "forward",
          toBack: true,
        },
      });
    },
    // 去登录
    toLoginPage() {
      router.push({
        name: "login",
        params: {
          animate: "forward",
          toBack: true,
        },
      });
    },
    // 复制
    copyID(username) {
      copyTextAsync(username)
        .then(() => {
          Toast({
            message: "复制成功！",
            position: "bottom",
          });
        })
        .catch((err) => {
          Toast({
            message: "复制失败！" + err,
            position: "bottom",
          });
        });
      // 新
    },
  },
  computed: {
    ...mapState(["isLoginState", "userInfo"]),
  },
  components: { ChangeIcon },
};
</script>
  <style scoped>
/* 头部个人信息 */
.my-top {
  margin-top: 4vh;
  display: flex;
  align-items: center;
  background-color: transparent;
  padding: 0.3rem;
}
.my-top .left {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.1rem;
  padding-right: 0;
}
.my-top .left .img {
  width: 2rem;
  height: 2rem;
  display: block;
  border-radius: 50%;
  background-color: var(--theme-color3);
  box-shadow: var(--shadow-color2);
  object-fit: cover;
  overflow: hidden;
  margin-right: 0.2rem;
}
.my-top .right {
  height: 2rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.1rem;
  padding-right: 0;
}
.my-top .title2 {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.2rem 0;
}
.my-top .right .title {
  cursor: pointer;
  width: 7em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-top .bg {
  z-index: -1;
  display: block;
  width: 3.5rem;
  object-fit: contain;
  position: absolute;
  right: 0.3rem;
  top: 0.7rem;
}
.my-top .signin {
  position: absolute;
  animation: 6s rubberBand2 0.3s infinite;
  right: 0.9rem;
  padding: 0.1rem 0.6rem;
  background-color: var(--tip-color2);
  color: var(--theme-color);
  opacity: 0.9;
  backdrop-filter: blur(10px);
  font-size: 0.4rem;
}
.tolg-btn {
  animation: 0.6s rubberBand 0.3s ease;
  width: 80%;
  margin: 0.2rem 0;
  padding: 0.2rem 0.1rem;
}

@keyframes rubberBand2 {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
  90% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
  91.5% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  93% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  94.5% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  96% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  97.8% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
}
@keyframes rubberBand {
  0% {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  to {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }
}
</style>
  