<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h5 q-mb-md">Uredi {{ gameName }}</div>

    <div class="q-gutter-md">
      <q-select
        filled
        v-model="ocjena"
        :options="ocjenaOptions"
        option-label="label"
        option-value="value"
        emit-value
        map-options
        label="Ocjena"
      />

      <q-select
        filled
        v-model="status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        emit-value
        map-options
        label="Status"
      />

      <q-input filled v-model="komentar" type="textarea" label="Komentar" />

      <q-btn
        label="Spremi"
        color="primary"
        @click="saveGame3"
        class="full-width"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
const ocjena = ref("");
const status = ref("planirano");
const komentar = ref("");
const gameName = ref("Učitavanje...");

const route = useRoute();
const router = useRouter();
const gameId = route.params.id;

const getGameName = async () => {
  try {
    const res = await api.get(`/igrice/${gameId}`);
    gameName.value = res.data.naziv_igrice;
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await getGameName();
  await puni_igre();
});

const ocjenaOptions = [
  { label: "Bez ocjene", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const statusOptions = [
  { label: "Planirano", value: "planirano" },
  { label: "Igram", value: "igram" },
  { label: "Završeno", value: "završeno" },
  { label: "Odustao", value: "odustao" },
];
async function saveGame3() {
  const user_id = localStorage.getItem("id_korisnika");

  try {
    const res = await api.put(`/liste/${user_id}/${gameId}`, {
      id_korisnika: user_id,
      id_igrice: gameId,
      ocjena: ocjena.value,
      status: status.value,
      komentar: komentar.value,
    });
    console.log(res.data);

    alert("Podaci su uspješno spremljeni!");

    const redirect = route.query.redirect;

    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/");
    }
  } catch (err) {
    console.error(err);
    alert("Došlo je do greške pri spremanju!");
  }
}
async function puni_igre() {
  const user_id = localStorage.getItem("id_korisnika");
  try {
    const res = await api.get(`/liste/${user_id}/${gameId}`);
    console.log(res.data);
    ocjena.value = res.data.ocjena;
    status.value = res.data.status;
    komentar.value = res.data.komentar;
  } catch (err) {
    console.error(err);
  }
}
</script>
