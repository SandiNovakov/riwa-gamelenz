<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Upravljanje developerima</div>

    <div class="q-mb-md">
      <q-btn
        color="primary"
        label="Dodaj novog developera"
        icon="person_add"
        @click="goToAddDeveloper"
      />
    </div>

    <div class="users-grid">
      <q-card v-for="dev in developers" :key="dev.id_developera" flat bordered>
        <q-card-section>
          <div class="text-h6">{{ dev.naziv_developera }}</div>
          <div class="text-caption text-grey-7">
            ID: {{ dev.id_developera }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="edit"
            color="primary"
            flat
            round
            @click.prevent
          >
            <q-tooltip>Uredi developera</q-tooltip>
          </q-btn>

          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            @click.prevent
          >
            <q-tooltip>Obriši developera</q-tooltip>
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
const developers = ref([]);

const goToAddDeveloper = () => {
  router.push("/dodaj-developera"); // prilagodi rutu po potrebi
};

const fetchDevelopers = async () => {
  try {
    const res = await api.get("/developeri");
    developers.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju developera:", err);
  }
};

onMounted(fetchDevelopers);
</script>

<style>
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
</style>
