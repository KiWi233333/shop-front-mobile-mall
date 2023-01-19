import Vue from "vue";
import "amfe-flexible"; // 移动端适配
import App from "./App.vue"; // App.js
import router from "./router"; // vue-router
import store from "./store"; // vuex
import "../public/css/animate.min.css";
import { Button, Tabbar, TabbarItem, Form, Field, Toast, NavBar, Notify, Switch, Checkbox, Icon, Dialog } from "vant";
// vant注册组件
Vue.use(Button).use(Tabbar).use(TabbarItem).use(Form).use(Icon).use(Field).use(Toast).use(NavBar).use(Notify).use(Switch).use(Checkbox).use(Dialog);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
