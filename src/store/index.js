import router from "@/router";
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

    purseInfo: {}, // 钱包信息

    addressList: {}, // 地址集合
  },
  getters: {
    // 获取token 并校验
    token(state) {
      if (state.token !== "") {
        const delay = (new Date().getTime() - state.loginTime) / 1000;
        console.log(delay);
        // 登录有效
        if (delay <= state.tokenLife) {
          return state.token; // 返回token
        } else {
          // 登录失效
          // 清空vuex
          for (const key in state.userInfo) {
            Vue.set(state.userInfo, key, "");
          }
          state.isLoginState = false;
          state.token = "";
          state.loginTime = 0;
          // 清空本地存储
          localStorage.removeItem(state.TOKEN_NAME);
          localStorage.removeItem("loginTime");
          sessionStorage.removeItem(state.TOKEN_NAME);
          // 跳转登录
          router.push({
            name: "login",
            params: { animate: "forward", toBack: true },
          });
          return "";
        }
      } else {
        return "";
      }
    },
  },
  mutations: {
    // 登录
    setToken(state, val) {
      state.token = val;
    },
    setLoginState(state, val) {
      state.isLoginState = val;
    },
    setLoginTime(state, val) {
      state.loginTime = val;
    },
    // 添加个人信息
    setUserInfo(state, userInfo) {
      for (const key in userInfo) {
        Vue.set(state.userInfo, key, userInfo[key]);
      }
    },
    // 添加钱包信息
    setPurseInfo(state, purseInfo) {
      for (const key in purseInfo) {
        Vue.set(state.purseInfo, key, purseInfo[key]);
      }
    },
    // 添加地址信息
    setAddressList(state, addressList) {
      for (const key in addressList) {
        Vue.set(state.addressList, key, addressList[key]);
      }
    },

    // 登出
    loginOut(state) {
      // 清空vuex
      state.isLoginState = false;
      for (const key in state.userInfo) {
        Vue.set(state.userInfo, key, "");
      }
      for (const key in state.purseInfo) {
        Vue.set(state.purseInfo, key, "");
      }
      state.token = "";
      state.loginTime = 0;
      // 清空本地存储
      localStorage.removeItem(state.TOKEN_NAME);
      sessionStorage.removeItem(state.TOKEN_NAME);
      localStorage.removeItem("loginTime");
    },
  },
  actions: {},
  modules: {},
});
