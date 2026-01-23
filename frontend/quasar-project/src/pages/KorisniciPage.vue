<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h5 q-mb-md">Pretraga korisnika</div>

    <div class="row">

      <q-input class="col-11" filled v-model="korisnicko_ime" label="Upiši korisničko ime" />

      <q-btn class="col-1 self-strech" label="Traži" color="primary" @click="fetchUsers" />

    </div>

    <div class="q-mt-lg q-gutter-md">
      <q-card
        v-for="user in users"
        :key="user.id_korisnika"
        @click="onCardClicked(user.id_korisnika)"
        class="cursor-pointer"
      >
        <q-card-section>
          <div class="text-h6">
            {{ user.korisnicko_ime }}
            <q-icon
              v-if="user.razina_prava === 1 && isAdminUser"
              name="admin_panel_settings"
              color="primary"
              size="sm"
            >
              <q-tooltip>Administrator</q-tooltip>
            </q-icon>
          </div>
          <div></div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            icon="admin_panel_settings"
            v-if="isAdminUser && user.razina_prava !== 1"
            dense
            color="primary"
            label="Dodaj kao administratora"
            @click.stop="onEditButtonClick(user)"
          >
            <q-tooltip>Izmjeni igricu</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const korisnicko_ime = ref("");
const router = useRouter();

const isAdminUser = ref(false);

function onCardClicked(user_id) {
  router.push(`/lista/${user_id}`);
}

const users = ref([]);

const checkAdmin = async () => {
  const userId = localStorage.getItem("id_korisnika");
  if (!userId) {
    isAdminUser.value = false;
    return;
  }

  try {
    const response = await api.get(`/administratori/check/${userId}`);
    isAdminUser.value = response.data.isAdmin === true;
  } catch (error) {
    console.error("Admin check failed:", error);
    isAdminUser.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const params = { korisnicko_ime: korisnicko_ime.value };
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/korisnici?${query}`);
    users.value = res.data;
  } catch (err) {
    console.error(err);
    users.value = [];
  }
};

async function onEditButtonClick(user) {
  await api.post(`/administratori/${user.id_korisnika}`);
  alert(`Korisnik: ${user.korisnicko_ime} dodan kao administrator!`);
  fetchUsers();
}

onMounted(() => {
  checkAdmin();
});
</script>
