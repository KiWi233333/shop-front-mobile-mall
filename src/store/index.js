import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Store
export default new Vuex.Store({
  state: {
    token: "", // token
    TOKEN_NAME: "SD_SHOP_TOKEN", // 本地存储的key值
    isLoginState: false, // 登录状态
    userInfo: {}, // 用户信息
  },
  getters: {},
  mutations: {
    setToken(state, val) {
      state.token = val;
    },
    setLoginState(state, val) {
      state.isLoginState = val;
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
