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
        <div>
          <q-btn v-if="isLoggedIn" flat icon="logout" @click="logout">
            Odjava
          </q-btn>
          <div v-else>Quasar v{{ $q.version }}</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          v-ripple
          :to="link.link || undefined"
          @click="link.action && link.action()"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios"; // Adjust import based on your setup

const router = useRouter();

// Reactive states
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const leftDrawerOpen = ref(false);

// Base links that everyone sees
const baseLinks = [
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
];

// Links that show ONLY when logged OUT
const loggedOutLinks = [
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

// Links that show ONLY when logged IN
const loggedInLinks = [
  {
    title: "Moja lista",
    caption: "Pogledajte svoju listu igrica",
    icon: "view_list",
    action: () => {
      const id_korisnika = localStorage.getItem("id_korisnika");
      router.push(`/lista/${id_korisnika}`);
    },
  },
  {
    title: "Upravljanje računom",
    caption: "Upravljanje postavkama računa",
    icon: "manage_accounts",
    link: "/upravljanje-racunom",
  },
  {
    title: "Pretraga korisnika",
    caption: "Pretraživanje korisničkih računa",
    icon: "people",
    link: "/pretraga-korisnika",
  },
];

// Links that show ONLY when user is ADMIN
const adminLinks = [
  {
    title: "Admin - Dodavanje igrice",
    caption: "Administratorsko dodavanje igrice",
    icon: "admin_panel_settings",
    link: "/admin/dodavanje-igrice",
  },
  {
    title: "Admin - Developeri",
    caption: "Upravljanje developerima",
    icon: "developer_mode",
    link: "/admin/developeri",
  },
  {
    title: "Admin - Izdavači",
    caption: "Upravljanje izdavačima",
    icon: "business",
    link: "/admin/izdavaci",
  },
  {
    title: "Admin - Platforme",
    caption: "Upravljanje platformama",
    icon: "devices",
    link: "/admin/platforme",
  },
  {
    title: "Admin - Žanrovi",
    caption: "Upravljanje žanrovima",
    icon: "category",
    link: "/admin/zanrovi",
  },
  {
    title: "Admin - Upravljanje dopuštenjima",
    caption: "Opcije administracije",
    icon: "admin_panel_settings",
    link: "/admin/upravljanje",
  },
];

// Check if user is logged in
const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem("id_korisnika");
  return isLoggedIn.value;
};

// Check if user is admin via API
const checkAdminStatus = async () => {
  const userId = localStorage.getItem("id_korisnika");

  if (!userId) {
    isAdmin.value = false;
    return false;
  }

  try {
    const response = await api.get(`/administratori/check/${userId}`);
    isAdmin.value = response.data.isAdmin === true;
    return isAdmin.value;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    isAdmin.value = false;
    return false;
  }
};

// Main function to check both
const checkUserStatus = async () => {
  const loggedIn = checkLoginStatus();

  if (loggedIn) {
    await checkAdminStatus();
  } else {
    isAdmin.value = false;
  }
};

// Computed property for the final links list
const linksList = computed(() => {
  const links = [...baseLinks];

  if (!isLoggedIn.value) {
    // User is NOT logged in - show registration/login
    links.push(...loggedOutLinks);
  } else {
    // User IS logged in - show user links
    links.push(...loggedInLinks);

    // If user is also admin - add admin links
    if (isAdmin.value) {
      links.push(...adminLinks);
    }
  }

  return links;
});

// Logout function
const logout = () => {
  localStorage.removeItem("id_korisnika");
  isLoggedIn.value = false;
  isAdmin.value = false;
  router.push("/prijava");
};

// Initialize on mount
onMounted(() => {
  checkUserStatus();

  // Re-check when route changes (optional, but useful)
  router.afterEach(() => {
    checkUserStatus();
  });
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
