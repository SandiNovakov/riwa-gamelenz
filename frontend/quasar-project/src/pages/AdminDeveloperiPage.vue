<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Upravljanje developerima</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="Dodaj developera"
          icon="add"
          @click="
            developerName = '';
            showDialog = true;
          "
        />
      </div>
    </div>

    <div class="developers-grid">
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
            @click="editDeveloper(dev)"
          />
          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            @click="deleteDeveloper(dev)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Single Dialog for Create/Edit -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ currentDeveloperId ? "Uredi developera" : "Dodaj developera" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="developerName"
            label="Naziv developera"
            outlined
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn
            color="primary"
            :label="currentDeveloperId ? 'Spremi' : 'Dodaj'"
            @click="saveDeveloper"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const developers = ref([]);
const showDialog = ref(false);
const developerName = ref("");
const currentDeveloperId = ref(null);

const fetchDevelopers = async () => {
  const res = await api.get("/developeri");
  developers.value = res.data;
};

const editDeveloper = (dev) => {
  developerName.value = dev.naziv_developera;
  currentDeveloperId.value = dev.id_developera;
  showDialog.value = true;
};

const saveDeveloper = async () => {
  if (!developerName.value.trim()) return;

  if (currentDeveloperId.value) {
    // Update
    await api.put(`/developeri/${currentDeveloperId.value}`, {
      naziv_developera: developerName.value,
    });
  } else {
    // Create
    await api.post("/developeri", {
      naziv_developera: developerName.value,
    });
  }

  showDialog.value = false;
  developerName.value = "";
  currentDeveloperId.value = null;
  fetchDevelopers();
};

const deleteDeveloper = async (dev) => {
  if (confirm(`Obrisati "${dev.naziv_developera}"?`)) {
    await api.delete(`/developeri/${dev.id_developera}`);
    fetchDevelopers();
  }
};

onMounted(fetchDevelopers);
</script>

<style>
.developers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
