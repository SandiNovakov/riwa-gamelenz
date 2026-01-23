<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Upravljanje administratorima</div>

    <q-banner
      v-if="message"
      :class="success ? 'bg-green text-white' : 'bg-red text-white'"
      class="q-mb-md"
      dense
    >
      {{ message }}
    </q-banner>

    
    <div class="q-mb-md">
      <q-btn
        color="primary"
        label="Dodaj novog administartora"
        icon="person_add"
        @click="goToAddAdmin"
      />
    </div>

    <div class="users-grid">
      <q-card v-for="user in users" :key="user.id_korisnika" flat bordered>
        <q-card-section>
          <div class="text-h6">{{ user.korisnicko_ime }}</div>
          <div class="text-caption text-grey-7">
            ID: {{ user.id_korisnika }}
          </div>
          <div class="text-caption text-grey-7">{{ user.email }}</div>
          <div class="text-caption text-grey-7">
            Prava: {{ user.razina_prava === 1 ? "Admin" : "Korisnik" }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="person_off"
            color="negative"
            flat
            round
            @click="removeAdmin(user.id_korisnika, user.korisnicko_ime)"
          >
            <q-tooltip>Ukloni admin prava</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";

const router = useRouter();
const users = ref([]);


const message = ref("");
const success = ref(true);


const goToAddAdmin = () => {
  router.push("/pretraga-korisnika"); 
};


const fetchUsers = async () => {
  try {
    const res = await api.get("/administratori");
    users.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju administratora:", err);
  }
};


const removeAdmin = async (id_korisnika, korisnicko_ime) => {
  try {
    await api.delete(`/administratori/${id_korisnika}`);
    
    message.value = `Korisniku "${korisnicko_ime}" su uklonjena administratorska prava!!!`;
    success.value = true;

    fetchUsers(); 
  } catch (err) {
    console.error("Greška pri uklanjanju admin prava:", err);
    message.value = `Greška pri uklanjanju admin prava korisniku "${korisnicko_ime}".`;
    success.value = false;
  }
};

onMounted(fetchUsers);
</script>

<style>
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
</style>
