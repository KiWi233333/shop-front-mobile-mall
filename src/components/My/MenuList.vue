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
        { title: "账号与安全", targetName: "user" },
        { title: "个人信息", targetName: "userinfo" },
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
              this.$store.commit("loginOut"); // 登出
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
  padding: 0 0.3rem;
}
.lg-off {
  margin-top: 0.4rem;
  width: 100%;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  font-size: 0.45rem;
}
</style>