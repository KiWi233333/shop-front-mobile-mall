import Vue from "vue";
import App from "./App.vue"; // App.js
import router from "./router"; // vue-router
import store from "./store"; // vuex
import "amfe-flexible"; // 移动端适配
import "../public/css/animate.min.css"; // 动画库
import {
  Button,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Toast,
  NavBar,
  Notify,
  Switch,
  Checkbox,
  Icon,
  Dialog,
  Loading,
  Swipe,
  SwipeItem,
  Lazyload,
  Empty,
  Tabs,
  Tab,
  List,
  Image as VanImage,
  Badge,
  Sidebar,
  SidebarItem,
  PullRefresh,
  ShareSheet,
  ImagePreview,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  Sku,
} from "vant";
// van按需t注册组件
Vue.use(Button)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Form)
  .use(Icon)
  .use(Field)
  .use(Toast)
  .use(NavBar)
  .use(Notify)
  .use(Switch)
  .use(Checkbox)
  .use(Dialog)
  .use(Swipe)
  .use(SwipeItem)
  .use(Loading)
  .use(Lazyload)
  .use(Tabs)
  .use(Tab)
  .use(List)
  .use(Empty)
  .use(VanImage)
  .use(Badge)
  .use(Sidebar)
  .use(SidebarItem)
  .use(PullRefresh)
  .use(ShareSheet)
  .use(ImagePreview)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Sku);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
