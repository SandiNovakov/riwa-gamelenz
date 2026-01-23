<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Upravljanje žanrovima</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="Dodaj žanr"
          icon="add"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Žanrovi Cards Grid -->
    <div class="zanrovi-grid">
      <q-card v-for="zanr in zanrovi" :key="zanr.id_zanra" flat bordered>
        <q-card-section>
          <div class="text-h6">{{ zanr.naziv_zanra }}</div>
          <div class="text-caption text-grey-7">ID: {{ zanr.id_zanra }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="edit"
            color="primary"
            flat
            round
            @click="openEditDialog(zanr)"
          >
            <q-tooltip>Uredi žanr</q-tooltip>
          </q-btn>

          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            @click="openDeleteDialog(zanr)"
          >
            <q-tooltip>Obriši žanr</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- CREATE/EDIT Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ isEditing ? "Uredi žanr" : "Dodaj novi žanr" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="zanrName" label="Naziv žanra" outlined autofocus />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn
            color="primary"
            :label="isEditing ? 'Spremi' : 'Dodaj'"
            @click="saveZanr"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DELETE Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Potvrdi brisanje</div>
        </q-card-section>

        <q-card-section>
          Obrisati žanr "{{ zanrToDelete?.naziv_zanra }}"?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="negative" label="Obriši" @click="deleteZanr" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const zanrovi = ref([]);

// Dialog states
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

// Simple variables
const isEditing = ref(false);
const zanrName = ref("");
const currentZanrId = ref(null);
const zanrToDelete = ref(null);

// Fetch žanrovi
const fetchZanrovi = async () => {
  try {
    const res = await api.get("/zanrovi");
    zanrovi.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju žanrova:", err);
  }
};

// Open Create Dialog
const openCreateDialog = () => {
  isEditing.value = false;
  zanrName.value = "";
  currentZanrId.value = null;
  showEditDialog.value = true;
};

// Open Edit Dialog
const openEditDialog = (zanr) => {
  isEditing.value = true;
  zanrName.value = zanr.naziv_zanra;
  currentZanrId.value = zanr.id_zanra;
  showEditDialog.value = true;
};

// Save Žanr (Create or Update)
const saveZanr = async () => {
  if (!zanrName.value.trim()) return;

  try {
    if (isEditing.value) {
      // Update
      await api.put(`/zanrovi/${currentZanrId.value}`, {
        naziv_zanra: zanrName.value,
      });
    } else {
      // Create
      await api.post("/zanrovi", {
        naziv_zanra: zanrName.value,
      });
    }

    showEditDialog.value = false;
    fetchZanrovi(); // Just reload the list
  } catch (err) {
    console.error("Greška pri spremanju žanra:", err);
  }
};

// Open Delete Dialog
const openDeleteDialog = (zanr) => {
  zanrToDelete.value = zanr;
  showDeleteDialog.value = true;
};

// Delete Žanr
const deleteZanr = async () => {
  if (!zanrToDelete.value) return;

  try {
    await api.delete(`/zanrovi/${zanrToDelete.value.id_zanra}`);
    showDeleteDialog.value = false;
    fetchZanrovi(); // Just reload the list
  } catch (err) {
    console.error("Greška pri brisanju žanra:", err);
  }
};

// Initialize
onMounted(() => {
  fetchZanrovi();
});
</script>

<style>
.zanrovi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
