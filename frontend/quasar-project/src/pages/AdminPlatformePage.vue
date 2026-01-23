<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Upravljanje platformama</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="Dodaj platformu"
          icon="add"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Platforme Cards Grid -->
    <div class="platforme-grid">
      <q-card
        v-for="platforma in platforme"
        :key="platforma.id_platforme"
        flat
        bordered
      >
        <q-card-section>
          <div class="text-h6">{{ platforma.naziv_platforme }}</div>
          <div class="text-caption text-grey-7">
            ID: {{ platforma.id_platforme }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="edit"
            color="primary"
            flat
            round
            @click="openEditDialog(platforma)"
          >
            <q-tooltip>Uredi platformu</q-tooltip>
          </q-btn>

          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            @click="openDeleteDialog(platforma)"
          >
            <q-tooltip>Obriši platformu</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <!-- CREATE/EDIT Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ isEditing ? "Uredi platformu" : "Dodaj novu platformu" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="platformaName"
            label="Naziv platforme"
            outlined
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn
            color="primary"
            :label="isEditing ? 'Spremi' : 'Dodaj'"
            @click="savePlatforma"
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
          Obrisati platformu "{{ platformaToDelete?.naziv_platforme }}"?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="negative" label="Obriši" @click="deletePlatforma" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const platforme = ref([]);

// Dialog states
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

// Simple variables
const isEditing = ref(false);
const platformaName = ref("");
const currentPlatformaId = ref(null);
const platformaToDelete = ref(null);

// Fetch platforme
const fetchPlatforme = async () => {
  try {
    const res = await api.get("/platforme");
    platforme.value = res.data;
  } catch (err) {
    console.error("Greška pri dohvaćanju platformi:", err);
  }
};

// Open Create Dialog
const openCreateDialog = () => {
  isEditing.value = false;
  platformaName.value = "";
  currentPlatformaId.value = null;
  showEditDialog.value = true;
};

// Open Edit Dialog
const openEditDialog = (platforma) => {
  isEditing.value = true;
  platformaName.value = platforma.naziv_platforme;
  currentPlatformaId.value = platforma.id_platforme;
  showEditDialog.value = true;
};

// Save Platforma (Create or Update)
const savePlatforma = async () => {
  if (!platformaName.value.trim()) return;

  try {
    if (isEditing.value) {
      // Update
      await api.put(`/platforme/${currentPlatformaId.value}`, {
        naziv_platforme: platformaName.value,
      });
    } else {
      // Create
      await api.post("/platforme", {
        naziv_platforme: platformaName.value,
      });
    }

    showEditDialog.value = false;
    fetchPlatforme(); // Just reload the list
  } catch (err) {
    console.error("Greška pri spremanju platforme:", err);
  }
};

// Open Delete Dialog
const openDeleteDialog = (platforma) => {
  platformaToDelete.value = platforma;
  showDeleteDialog.value = true;
};

// Delete Platforma
const deletePlatforma = async () => {
  if (!platformaToDelete.value) return;

  try {
    await api.delete(`/platforme/${platformaToDelete.value.id_platforme}`);
    showDeleteDialog.value = false;
    fetchPlatforme(); // Just reload the list
  } catch (err) {
    console.error("Greška pri brisanju platforme:", err);
  }
};

// Initialize
onMounted(() => {
  fetchPlatforme();
});
</script>

<style>
.platforme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
