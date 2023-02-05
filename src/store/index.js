import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Store
export default new Vuex.Store({
  state: {
    token: "", // token
    loginTime: 0,
    tokenLife: 1 * 3600, //一小时
    TOKEN_NAME: "SD_SHOP_TOKEN", // 本地存储的key值
    isLoginState: false, // 登录状态
    userInfo: {}, // 用户信息
  },
  getters: {
    // 获取token
    token(state) {
      if (state.token !== "") {
        const delay = new Date() - +localStorage.getItem("loginTime");
        if (delay > state.tokenLife) {
          return state.token;
        } else {
          state.token = "";
          state.loginTime = 0;
          state.isLoginState = false;
        }
      } else {
        return "";
      }
    },
  },
  mutations: {
    setToken(state, val) {
      state.token = val;
    },
    setLoginState(state, val) {
      state.isLoginState = val;
    },
    setLoginTime(state, val) {
      state.loginTime = val;
    },
    // 修改个人信息
    setUserInfo(state, userInfo) {
      for (const key in userInfo) {
        Vue.set(state.userInfo, key, userInfo[key]);
      }
    },
  },
  actions: {},
  modules: {},
});
