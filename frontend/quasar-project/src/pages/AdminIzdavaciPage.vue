<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Upravljanje izdavačima</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="Dodaj izdavača"
          icon="add"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Izdavači Cards Grid -->
    <div class="izdavaci-grid">
      <q-card
        v-for="izdavac in izdavaci"
        :key="izdavac.id_izdavaca"
        flat
        bordered
      >
        <q-card-section>
          <div class="text-h6">{{ izdavac.naziv_izdavaca }}</div>
          <div class="text-caption text-grey-7">
            ID: {{ izdavac.id_izdavaca }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="edit"
            color="primary"
            flat
            round
            @click="openEditDialog(izdavac)"
          >
            <q-tooltip>Uredi izdavača</q-tooltip>
          </q-btn>

          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            @click="openDeleteDialog(izdavac)"
          >
            <q-tooltip>Obriši izdavača</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- CREATE/EDIT Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ isEditing ? "Uredi izdavača" : "Dodaj novog izdavača" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="izdavacName"
            label="Naziv izdavača"
            outlined
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn
            color="primary"
            :label="isEditing ? 'Spremi' : 'Dodaj'"
            @click="saveIzdavac"
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
          Obrisati izdavača "{{ izdavacToDelete?.naziv_izdavaca }}"?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="negative" label="Obriši" @click="deleteIzdavac" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const izdavaci = ref([]);

// Dialog states
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

// Simple variables
const isEditing = ref(false);
const izdavacName = ref("");
const currentIzdavacId = ref(null);
const izdavacToDelete = ref(null);

// Fetch izdavači
const fetchIzdavaci = async () => {
  try {
    const res = await api.get("/izdavaci");
    izdavaci.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju izdavača:", err);
  }
};

// Open Create Dialog
const openCreateDialog = () => {
  isEditing.value = false;
  izdavacName.value = "";
  currentIzdavacId.value = null;
  showEditDialog.value = true;
};

// Open Edit Dialog
const openEditDialog = (izdavac) => {
  isEditing.value = true;
  izdavacName.value = izdavac.naziv_izdavaca;
  currentIzdavacId.value = izdavac.id_izdavaca;
  showEditDialog.value = true;
};

// Save Izdavac (Create or Update)
const saveIzdavac = async () => {
  if (!izdavacName.value.trim()) return;

  try {
    if (isEditing.value) {
      // Update
      await api.put(`/izdavaci/${currentIzdavacId.value}`, {
        naziv_izdavaca: izdavacName.value,
      });
    } else {
      // Create
      await api.post("/izdavaci", {
        naziv_izdavaca: izdavacName.value,
      });
    }

    showEditDialog.value = false;
    fetchIzdavaci(); // Just reload the list
  } catch (err) {
    console.error("Greška pri spremanju izdavača:", err);
  }
};

// Open Delete Dialog
const openDeleteDialog = (izdavac) => {
  izdavacToDelete.value = izdavac;
  showDeleteDialog.value = true;
};

// Delete Izdavac
const deleteIzdavac = async () => {
  if (!izdavacToDelete.value) return;

  try {
    await api.delete(`/izdavaci/${izdavacToDelete.value.id_izdavaca}`);
    showDeleteDialog.value = false;
    fetchIzdavaci(); // Just reload the list
  } catch (err) {
    console.error("Greška pri brisanju izdavača:", err);
  }
};

// Initialize
onMounted(() => {
  fetchIzdavaci();
});
</script>

<style>
.izdavaci-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
