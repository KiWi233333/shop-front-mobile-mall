<template>
  <div>{{}}</div>
</template>

<script>
export default {
  name: "MyView",
  data() {
    return {
      isLogin: false,
    };
  },
  mounted() {
    // 登录状态初始化
    this.isLogin = this.$store.state.isLoginState;
  },
  components: {},
};
</script>
