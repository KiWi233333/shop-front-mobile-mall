import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Store
export default new Vuex.Store({
  state: {
    TOKEN_NAME: "SD_SHOP_TOKEN",
    token: "",
    isLoginState: false,
  },
  getters: {},
  mutations: {
    setToken(state, val) {
      state.token = val;
    },
    setLoginState(state, val) {
      state.isLoginState = val;
    },
  },
  actions: {},
  modules: {},
});
