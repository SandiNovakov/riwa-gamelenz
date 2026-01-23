<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Upravljanje administratorima</div>

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
          <!-- Dugme za skidanje admin prava -->
          <q-btn
            icon="person_off"
            color="negative"
            flat
            round
            @click="removeAdmin(user.id_korisnika)"
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
import { api } from "boot/axios";

const users = ref([]);

const fetchUsers = async () => {
  try {
    const res = await api.get("/administratori");
    users.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju administratora:", err);
  }
};

const removeAdmin = async (id_korisnika) => {
  try {
    await api.delete(`/administratori/${id_korisnika}`);
    fetchUsers(); // refresha listu nakon update-a
  } catch (err) {
    console.error("Greška pri uklanjanju admin prava:", err);
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
