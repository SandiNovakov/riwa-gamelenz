const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'dodavanje-igrice/:id', component: () => import('pages/AddGame.vue')},
      { path: 'igrica/:id', component: () => import('pages/GameDetail.vue')},
      { path: 'pregled-igrica', component: () => import('pages/BrowseGames.vue')},
      { path: 'registracija', component: () => import('pages/RegistracijaPage.vue')},
  ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
