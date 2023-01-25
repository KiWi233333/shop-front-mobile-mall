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
import MenuItem from "./MenuItem.vue";
export default {
  name: "MenuList",
  components: { MenuItem },
  data() {
    return {
      option: [
        { title: "地址管理", targetName: "address" },
        { title: "个人信息", targetName: "info" },
        { title: "个人信息", targetName: "info" },
        { title: "设置", targetName: "option" },
      ],
    };
  },
  methods: {
    // 退出登录
    cannelLogin() {
      console.log(1);
    },
  },
};
</script>
<style scoped>
.lg-off {
  width: 100%;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
</style>