<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> GameLenz </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          v-ripple
          :to="link.link"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const linksList = [
  {
    title: "Naslovnica",
    caption: "Početna stranica",
    icon: "home",
    link: "/",
  },
  {
    title: "Pregled igrica",
    caption: "Pretraživanje svih igrica",
    icon: "search",
    link: "/pregled-igrica",
  },
  {
    title: "Registracija",
    caption: "Otvaranje novog korisničkog računa",
    icon: "person_add",
    link: "/registracija",
  },
  {
    title: "Prijava",
    caption: "Prijava u korisnički račun",
    icon: "login",
    link: "/prijava",
  },
];
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
