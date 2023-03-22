import Vue from "vue";
import App from "./App.vue"; // App.js
import router from "./router"; // vue-router
import store from "./store"; // vuex
import * as filters from "@/util/filters";
import "amfe-flexible"; // 移动端适配
import "@/assets/css/animate.min.css"; // 动画库
import BaiduMap from "vue-baidu-map";
// 指令
import "@/util/directive";
// 按需ui库
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
  Tag,
  Rate,
  Uploader,
  Popup,
  Cell,
  CellGroup,
  Calendar,
  Area,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Card,
  SubmitBar,
  Popover,
  Steps,
  Step,
  Stepper,
  NoticeBar,
} from "vant";

// 全局过滤器
for (const key in filters) {
  Vue.filter(key, filters[key]);
}
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
  .use(Sku)
  .use(Tag)
  .use(Rate)
  .use(Uploader)
  .use(Popup)
  .use(Cell)
  .use(CellGroup)
  .use(Calendar)
  .use(Area)
  .use(CheckboxGroup)
  .use(Radio)
  .use(RadioGroup)
  .use(Card)
  .use(SubmitBar)
  .use(Popover)
  .use(Steps)
  .use(Stepper)
  .use(Rate)
  .use(NoticeBar)
  .use(Step);

// 配置
Vue.config.productionTip = false;
Dialog.setDefaultOptions({
  transition: "popup",
});

// 百度地图
Vue.use(BaiduMap, {
  ak: "4da3Cxy4BG5RtWNa4GOPeCKTlDx7ENtr",
  ControlAnchor: "BMAP_ANCHOR_BOTTOM_LEFT",
  enableDragging: true,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
