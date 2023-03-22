import { exitLogin } from "@/api/user/users";
import router from "@/router";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Store
export default new Vuex.Store({
  state: {
    token: "", // token
    loginTime: +localStorage.getItem("loginTime"),
    tokenLife: 1 * 3600 * 1000, //一小时
    TOKEN_NAME: "SD_SHOP_TOKEN", // 本地存储的key值
    isLoginState: false, // 登录状态
    userInfo: {}, // 用户信息

    purseInfo: {}, // 钱包信息

    addressList: {}, // 地址集合

    commentId: "",
    showCommentPopup: false, // 地址评价栏
  },
  getters: {
    // 获取token 并校验
    token(state) {
      if (state.token !== "") {
        // 续签
        const date = new Date().getTime();
        const delay = date - +state.loginTime;
        console.log(delay);
        // 登录有效
        if (delay <= state.tokenLife) {
          localStorage.setItem("loginTime", `${date}`);
          return state.token; // 返回token
        } else {
          // 清空vuex
          for (const key in state.userInfo) {
            Vue.set(state.userInfo, key, "");
          }
          state.isLoginState = false;
          state.token = "";
          state.loginTime = -1;
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
        // 跳转登录
        router.push({
          name: "login",
          params: { animate: "forward", toBack: true },
        });
        return "";
      }
    },
  },
  mutations: {
    // 登录
    setToken(state, { token, savePwd }) {
      const date = new Date().getTime();
      state.loginTime = date;
      localStorage.setItem("loginTime", date);
      if (savePwd) {
        localStorage.setItem(state.TOKEN_NAME, token);
      } else {
        sessionStorage.setItem(state.TOKEN_NAME, token);
      }
      state.token = token;
    },
    // 登录状态
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

    // 设置地址弹窗
    setShowCommentPopup(state, { show, commentId }) {
      state.showCommentPopup = show;
      state.commentId = commentId;
    },
    // 登出
    loginOut(state) {
      // 退出登录请求loginOut
      exitLogin(state.token)
        .then(res => {
          if (res.status === 200 && res.data.code === 20011) {
            // console.log("退出成功！");
          } else {
            console.log("退出失败！");
          }
        })
        .catch(() => {
          console.log("退出失败！");
        });
      // 清空vuex
      state.isLoginState = false;
      for (const key in state.userInfo) {
        Vue.set(state.userInfo, key, "");
      }
      for (const key in state.purseInfo) {
        Vue.set(state.purseInfo, key, "");
      }
      state.token = "";
      state.loginTime = -1;
      // 清空本地存储
      localStorage.removeItem(state.TOKEN_NAME);
      sessionStorage.removeItem(state.TOKEN_NAME);
      localStorage.removeItem("loginTime");
    },
  },
  actions: {},
  modules: {},
});
