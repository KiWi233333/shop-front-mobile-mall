import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import NotFund from "../views/NotFund.vue";
import ShopcarView from "../views/ShopcarView.vue";
import CategoryView from "../views/CategoryView.vue";
import MyView from "../views/MyView.vue";
import OrderView from "../views/OrderView.vue";
import CollectView from "../views/CollectView.vue";
import SearchView from "../views/SearchView.vue";
import GoodsDetail from "../views/GoodsDetail.vue";
import EventView from "../views/EventView.vue";
import CommentDetail from "../views/comment/CommentDetail";
import store from "@/store";
Vue.use(VueRouter);
const routes = [
  // 1.主页
  {
    path: "/",
    component: HomeView,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        name: "home",
        meta: {
          title: "水院商城",
          keepAlive: true,
          lv: 1,
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
    path: "/active",
    name: "active",
    component: EventView,
    meta: {
      title: "活动",
      lv: 2,
    },
  },
  // 2.分类页面
  {
    path: "/category",
    name: "category",
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
    component: ShopcarView,
    meta: {
      title: "购物车",
      lv: 1,
      keepAlive: true,
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

  // 4.1.订单页面
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

  // 4.3 登录页面
  {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: {
      title: "登录",
      lv: 2, // 二级页面
    },
  },
  // 注册页面
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
      permission: true,
    },
  },

  // 6 评论详情页面
  {
    path: "/commentdetail",
    name: "commentdetail",
    component: CommentDetail,
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
    component: NotFund,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // 浏览器标题设置
  document.title = to.meta?.title ?? "水院商城";
  // 权限设置
  if (to.meta.permission) {
    // (async () => {
    // const res = await checkUser(store.state.token);
    // if (res.data.success) {
    //   next();
    // } else {
    //   next({
    //     name: "login",
    //     params: {
    //       animate: "forward",
    //     },
    //   });
    // }
    // })();
    if (store.getters.token !== "") {
      next();
    } else {
      router.push({
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
