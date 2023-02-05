<template>
  <div class="animate__animated animate__fadeIn MenuList">
    <menu-item
      v-for="(p, i) in option"
      :title="p.title"
      :target-name="p.targetName"
      :key="i"
    />
    <button class="v-btn lg-off" @click="cannelLogin">退出登录</button>
  </div>
</template>
<script>
import { Dialog } from "vant";
import MenuItem from "./MenuItem.vue";
export default {
  name: "MenuList",
  components: { MenuItem },
  data() {
    return {
      option: [
        { title: "地址管理", targetName: "address" },
        { title: "个人信息", targetName: "info" },
        { title: "设置", targetName: "option" },
      ],
    };
  },
  methods: {
    // 退出登录
    cannelLogin() {
      Dialog.confirm({
        title: "确认退出登录？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            setTimeout(() => {
              this.$store.commit("setLoginState", false);
              this.$store.commit("setToken", "");
              this.$store.commit("setLoginTime", 0);
              this.$store.commit("setUserInfo", {});
              // 清除登录信息
              localStorage.removeItem(this.$store.state.TOKEN_NAME);
              sessionStorage.removeItem(this.$store.state.TOKEN_NAME);
              localStorage.removeItem("loginTime");
              done(); // 完成
            }, 1500);
          } else {
            done(); // 完成
          }
        },
      }).catch(() => {});
    },
  },
};
</script>
<style scoped>
.MenuList {
  margin-top: 0.5rem;
}
.lg-off {
  width: 100%;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  font-size: 0.45rem;
}
</style>