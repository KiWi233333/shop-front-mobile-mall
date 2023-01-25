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

Vue.use(VueRouter);
const routes = [
  // 主页
  {
    path: "/",
    name: "index",
    component: HomeView,
    children: [
      {
        path: "home",
        name: "home",
        component: HomeView,
        meta: {
          lv: 1,
          keepAlive: true,
        },
      },
    ],
    meta: {
      lv: 1,
      keepAlive: true,
    },
  },

  // 分类页面
  {
    path: "/category",
    name: "category",
    component: CategoryView,
    meta: {
      lv: 1,
      keepAlive: true,
    },
  },

  // 购物车页面
  {
    path: "/shopcar",
    name: "shopcar",
    component: ShopcarView,
    meta: {
      lv: 1,
      keepAlive: true,
    },
  },

  // 我的页面
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
  // 订单页面
  {
    name: "order",
    path: "/my/order",
    component: OrderView,
    meta: {
      lv: 2,
    },
  },
  // 收藏页面
  {
    name: "collect",
    path: "/my/collect",
    component: CollectView,
    meta: {
      lv: 2,
    },
  },

  // 登录页面
  {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: {
      lv: 2, // 二级页面
    },
  },
  // 注册页面
  {
    name: "regist",
    path: "/regist",
    component: RegisterView,
    meta: {
      lv: 2,
      keepAlive: true,
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
  if (to.meta.permission) {
    router.push({
      name: "notFund",
      params: {
        text: "还未登录！",
      },
    });
  } else {
    next();
  }
});
export default router;
