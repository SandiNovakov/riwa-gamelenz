const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "dodavanje-igrice/:id",
        component: () => import("pages/AddGame.vue"),
        meta: { requireLogin: true },
      },
      {
        path: "uredivanje-igrice/:id",
        component: () => import("pages/editGame.vue"),
        meta: { requireLogin: true },
      },
      { path: "igrica/:id", component: () => import("pages/GameDetail.vue") },
      {
        path: "pregled-igrica",
        component: () => import("pages/BrowseGames.vue"),
      },
      {
        path: "registracija",
        component: () => import("pages/RegistracijaPage.vue"),
      },
      { path: "prijava", component: () => import("pages/PrijavaPage.vue") },
      {
        path: "lista",
        component: () => import("pages/AccountPage.vue"),
        meta: { requireLogin: true },
      },
      {
        path: "pretraga-korisnika",
        component: () => import("pages/KorisniciPage.vue"),
      },
      {
        path: "upravljanje-racunom",
        component: () => import("pages/PostavkePage.vue"),
        meta: { requireLogin: true },
      },
      {
        path: "admin/dodavanje-igrice",
        component: () => import("pages/AdminDodavanjeIgricePage.vue"),
        meta: { requireAdmin: true },
      },
      {
        path: "admin/igrica",
        component: () => import("pages/AdminIgricaPage.vue"),
        meta: { requireAdmin: true },
      },
      {
        path: "admin/developeri",
        component: () => import("pages/AdminDeveloperiPage.vue"),
        //meta: { requireAdmin: true },
      },
      {
        path: "admin/izdavaci",
        component: () => import("pages/AdminIzdavaciPage.vue"),
        meta: { requireAdmin: true },
      },
      {
        path: "admin/platforme",
        component: () => import("pages/AdminPlatformePage.vue"),
        meta: { requireAdmin: true },
      },
      {
        path: "admin/zanrovi",
        component: () => import("pages/AdminZanroviPage.vue"),
        meta: { requireAdmin: true },
      },
      {
        path: "admin/upravljanje",
        component: () => import("pages/AdminUpravljanjePage.vue"),
        //meta: { requireAdmin: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
