import { createRouter, createWebHashHistory } from "vue-router";

// 导入组件
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout.vue";
import ArticleCategory from "@/views/article/ArticleCategory.vue";
import ArticleManage from "@/views/article/ArticleManage.vue";
import UserAvatar from "@/views/user/UserAvatar.vue";
import UserInfo from "@/views/user/UserInfo.vue";
import UserResetPassword from "@/views/user/UserResetPassword.vue";

// 定义路有关系
const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Layout,
    redirect: "/article/manage",
    children: [
      { path: "/article/category", component: ArticleCategory },
      { path: "/article/manage", component: ArticleManage },
      { path: "/user/avatar", component: UserAvatar },
      { path: "/user/info", component: UserInfo },
      { path: "/user/rePassword", component: UserResetPassword },
    ],
  },
];

// 创建路由器
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
