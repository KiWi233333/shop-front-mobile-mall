<template>
  <div class="MenuList">
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
      let _this = this;
      Dialog.confirm({
        title: "确认退出登录？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            setTimeout(function () {
              _this.$store.commit("setLoginState", false);
              _this.$store.commit("setToken", "");
              localStorage.setItem(_this.$store.state.TOKEN_NAME, "");
              sessionStorage.setItem(_this.$store.state.TOKEN_NAME, "");
              done(); // 完成
            }, 1500);
          } else {
            done(); // 完成
          }
        },
      }).catch((res) => {
        _this = res;
      });
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