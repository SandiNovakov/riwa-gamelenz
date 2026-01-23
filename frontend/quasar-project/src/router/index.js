import { defineRouter } from "#q-app/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

function checkLogin() {
  return LocalStorage.getItem("id_korisnika");
}

async function checkAdmin() {
  const user_id = LocalStorage.getItem("id_korisnika");

  if (user_id === null) {
    return false;
  }
  const res = await api.get(`/administratori/check/${user_id}`);

  return res.data.isAdmin;
}

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    if (to.meta.requireLogin && !checkLogin()) {
      next({
        path: "/prijava",
        query: { redirect: to.fullPath },
      });
    } else if (to.meta.requireAdmin) {
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        next({ path: "/" });
      }
    } else {
      next();
    }
  });

  return Router;
});
