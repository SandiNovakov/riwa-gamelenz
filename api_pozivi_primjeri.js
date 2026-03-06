import { api } from "boot/axios"; // pretpostavljamo da imate boot file za Axios

// --- GET ---
async function getUsers() {
  try {
    const res = await api.get("/users"); // GET /users
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// --- POST ---
async function createUser() {
  try {
    const res = await api.post("/users", {
      korisnicko_ime: "test",
      lozinka: "123",
    }); // POST /users s body
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// --- PUT ---
async function updateUser() {
  try {
    const res = await api.put("/users/1", {
      lozinka: "novaLozinka",
    }); // PUT /users/:id
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// --- DELETE ---
async function deleteUser() {
  try {
    const res = await api.delete("/users/1"); // DELETE /users/:id
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// --- RAD SA SLIKAMA ---
// # Spremanje nove slike
import { saveImage } from "src/utils/images";
import { ref } from "vue";

const slika = ref(null); // Ovo se poveže s ImageUploader

// Nakon što spremite glavni objekt (npr. igricu, korisnika...)
async function nakonSpremanja(idNovogObjekta) {
  if (slika.value) {
    // slika.value = File objekt iz ImageUploader-a
    await saveImage("igrica", idNovogObjekta, "cover", slika.value);
    // Parametri: (tablica, ID_veze, tip_slike, file)
  }
}

// # Dohvat nove slike
import { getImage } from "src/utils/images";
import { ref, onMounted } from "vue";

const previewUrl = ref(null);

onMounted(async () => {
  // Dohvati sliku - vraća data URL ili null
  previewUrl.value = await getImage("igrica", gameId, "cover");
  // Ako postoji slika, previewUrl = "data:image/jpeg;base64,/9j..."
});

// # ImageUploader
<template>
  <!-- predajemo initialPreview da pokaže postojeću sliku -->
  <ImageUploader
    v-model="slika"
    :initial-preview="previewUrl"
    label="Odaberi sliku"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getImage } from "src/utils/images";
import ImageUploader from "components/ImageUploader.vue";

const slika = ref(null);          // za novi file
const previewUrl = ref(null);      // za prikaz postojeće

onMounted(async () => {
  // Prvo dohvati postojeću sliku
  previewUrl.value = await getImage("igrica", id, "cover");
});

async function spremi() {
  // Ažuriraj ostale podatke...
  
  // Ako je odabrana nova slika, spremi je (automatski radi PUT ili POST)
  if (slika.value) {
    await saveImage("igrica", id, "cover", slika.value);
  }
}
</script>

