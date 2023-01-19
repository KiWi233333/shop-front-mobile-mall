import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import NotFund from "../views/NotFund.vue";
import ShopcarView from "../views/ShopcarView.vue";
import CategoryView from "../views/CategoryView.vue";
import MyView from "../views/MyView.vue";

Vue.use(VueRouter);
const routes = [
  // 主页
  {
    path: "/",
    name: "index",
    component: HomeView,
    meta: {
      lv: 1,
      keepAlive: true,
    },
  },

  // 首页页面
  {
    path: "/home",
    name: "home",
    component: HomeView,
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
    path: "/my",
    name: "my",
    component: MyView,
    meta: {
      lv: 1,
      keepAlive: true,
    },
  },

  // 登录页面
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      lv: 2, // 二级页面
    },
  },
  // 注册页面
  {
    path: "/regist",
    name: "regist",
    component: RegisterView,
    meta: {
      lv: 2,
      keepAlive: true,
    },
  },

  // 404页面
  {
    path: "/404",
    name: "notFund",
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
