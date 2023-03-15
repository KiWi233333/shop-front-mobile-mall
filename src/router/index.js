import Vue from "vue";
// home
import VueRouter from "vue-router";
import HomeView from "@/views/home/HomeView";
import MyView from "@/views/home/MyView.vue";
import ShopcartView from "@/views/home/ShopcartView.vue";
import CategoryView from "@/views/home/CategoryView.vue";
// 登录注册
import LoginView from "@/views/login/LoginView.vue";
import RegisterView from "@/views/login/RegisterView.vue";
// 二级页面
import CollectView from "@/views/second/CollectView.vue";
import SearchView from "@/views/second/SearchView.vue";
import EventView from "@/views/second/EventView.vue";
import RechargeView from "@/views/second/RechargeView";
import PurseView from "@/views/second/PurseView";
import UserView from "@/views/second/UserView";
import InfoView from "@/views/second/InfoView";
import SigninView from "@/views/second/SigninView";
import AddressView from "@/views/second/AddressView";
import BillsView from "@/views/second/BillsView";
// 商品详情
import GoodsDetail from "@/views/goods/GoodsDetail.vue";
// 评论
import CommentDetail from "@/views/comment/CommentDetail";
import CommentView from "@/views/comment/CommentView";
import AddCommentView from "@/views/comment/AddCommentView";

// 订单
import OrderView from "@/views/orders/OrderView.vue";
import CheckOrder from "@/views/orders/CheckOrder";

import store from "@/store";
Vue.use(VueRouter);
const routes = [
  // 1.主页
  {
    path: "/",
    component: HomeView,
    children: [
      { path: "", redirect: "/home" },
      {
        path: "home",
        name: "home",
        meta: {
          title: "水院商城",
          lv: 1,
          keepAlive: true,
        },
      },
    ],
  },
  // 1.1 搜索页面
  {
    path: "/search",
    name: "search",
    component: SearchView,
    meta: {
      title: "搜索",
      lv: 2,
    },
  },
  // 1.2 活动页面
  {
    name: "active",
    path: "/events",
    component: EventView,
    meta: {
      title: "活动",
      lv: 2,
    },
  },
  // 2.分类页面
  {
    name: "category",
    path: "/category",
    component: CategoryView,
    meta: {
      title: "分类",
      lv: 1,
      keepAlive: true,
    },
  },

  // 3.购物车页面
  {
    name: "shopcar",
    path: "/shopcar",
    component: ShopcartView,
    meta: {
      title: "购物车",
      lv: 1,
      // keepAlive: true,
    },
  },

  // 4.我的页面
  {
    name: "my",
    path: "/my",
    component: MyView,
    meta: {
      title: "个人中心",
      lv: 1,
      keepAlive: true,
    },
  },
  // 4.1 订单页面
  {
    name: "order",
    path: "/my/order",
    component: OrderView,
    meta: {
      title: "订单",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },
  // 4.2 收藏页面
  {
    name: "collect",
    path: "/my/collect",
    component: CollectView,
    meta: {
      title: "收藏",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },
  // 4.3.积分页面
  {
    name: "recharge",
    path: "/my/recharge",
    component: RechargeView,
    meta: {
      title: "积分页面",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },
  // 4.4 签到页面
  {
    path: "/my/signin",
    name: "signin",
    component: SigninView,
    meta: {
      title: "签到",
      lv: 2,
      permission: true,
    },
  },
  // 4.4.钱包页面
  {
    name: "purse",
    path: "/my/purse",
    component: PurseView,
    meta: {
      title: "钱包",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },
  // 4.5 个人信息页面
  {
    name: "user",
    path: "/my/user",
    component: UserView,
    meta: {
      title: "个人信息",
      lv: 2,
      permission: true,
    },
  },
  {
    name: "userinfo",
    path: "/my/info",
    component: InfoView,
    meta: {
      title: "基本信息",
      lv: 2,
      permission: true,
    },
  },
  // 4.6 账单页面
  {
    name: "bills",
    path: "/my/bills",
    component: BillsView,
    meta: {
      title: "收获地址",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },
  // 4.7 地址集合页面
  {
    name: "address",
    path: "/address",
    component: AddressView,
    meta: {
      title: "收获地址",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },

  // 1）登录页面
  {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: {
      title: "登录",
      lv: 2, // 二级页面
    },
  },
  // 2）注册页面
  {
    name: "regist",
    path: "/regist",
    component: RegisterView,
    meta: {
      title: "注册新用户",
      lv: 2,
      keepAlive: true,
    },
  },

  // 5.商品详情页
  {
    name: "detail",
    path: "/detail",
    component: GoodsDetail,
    meta: {
      title: "商品详情",
      lv: 2,
      // permission: true,
    },
  },

  // 5.1 评论详情页面
  {
    name: "commentdetail",
    path: "/comments/detail",
    component: CommentDetail,
    meta: {
      title: "评论",
      lv: 2,
      permission: true,
    },
  },
  // 5.1.b 评论列表页面
  {
    name: "comment",
    path: "/comments",
    component: CommentView,
    meta: {
      title: "评论列表",
      lv: 2,
      keepAlive: true,
      permission: true,
    },
  },

  // 5.2 提交订单页面
  {
    path: "/checkorder",
    name: "checkorder",
    component: CheckOrder,
    meta: {
      title: "提交订单",
      lv: 2,
      permission: true,
    },
  },

  // 6 去评论页面
  {
    path: "/comment/add",
    name: "addcomment",
    component: AddCommentView,
    meta: {
      title: "评论",
      lv: 2,
      permission: true,
    },
  },

  // 404页面
  {
    name: "notFund",
    path: "/404",
    component: res => require(["@/views/NotFund.vue"], res),
  },
];

const router = new VueRouter({
  // mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
// 拦截器
router.beforeEach((to, from, next) => {
  // 浏览器标题设置
  document.title = to.meta?.title || "水院商城";
  // 权限设置
  if (to.meta.permission) {
    // 权限成功
    if (store.getters.token) {
      next();
    } else {
      next({
        name: "login",
        params: {
          animate: "forward",
          toBack: true,
        },
      });
    }
  } else {
    next();
  }
});

export default router;
