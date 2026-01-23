<template>
  <q-page padding class="flex justify-center items-start">
    
    <div class="all column q-pa-md justify-center">

      <div class="text-h5 q-mb-md">Izmjena igrice: {{ gameName }}</div>

        <div class="column q-gutter-md">
          <q-input
            filled
            v-model="imeIgrice"
            label="Naziv igre"
          />

          <q-input
            filled
            v-model="date"
            type="date"
            label="Datum izdanja"
            class="col-12 col-md"
          />

          <q-select
            filled
            v-model="izdavac"
            :options="izdavacOptions"
            option-label="naziv_izdavaca"
            option-value="id_izdavaca"
            label="Izdavač"
            emit-value
            map-options
          />  

          <q-select
            filled
            v-model="developer"
            :options="developerOptions"
            option-label="naziv_developera"
            option-value="id_developera"
            label="Developer"
            emit-value
            map-options
          /> 

          <q-select
            filled
            v-model="zanr"
            :options="zanrOptions"
            option-label="naziv_zanra"
            option-value="id_zanra"
            label="Žanr"
            emit-value
            map-options
          /> 

          <q-input filled v-model="opis" type="textarea" label="Opis" />

          <q-btn
            class="self-center"
            label="Spremi"
            color="primary"
            @click="updateGame"
          />
      </div>

    </div>

  </q-page>
</template>

<script setup>
  import { api } from 'boot/axios'
  import {useRoute, useRouter} from 'vue-router'
  import {ref, onMounted} from 'vue'

  const router = useRouter();
  const route = useRoute();
  const gameId = route.params.id;
  const gameName = ref("Učitavanje...");

  const imeIgrice = ref("");
  const date = ref ("");
  const developer = ref("");
  const izdavac = ref("");
  const zanr = ref("");
  const opis = ref("");

  const developerOptions = ref([]);
  const izdavacOptions = ref([]);
  const zanrOptions = ref([]);

  const fetchOptions = async () => {
  
    const dev = await api.get('/developeri');
    const izd = await api.get('/izdavaci');
    const zan = await api.get('/zanrovi');

    developerOptions.value = dev.data;
    izdavacOptions.value = izd.data;
    zanrOptions.value = zan.data;

  }

  const getGame = async () => {
  try {
    const res = await api.get(`/igrice/${gameId}`);
    gameName.value = res.data.naziv_igrice;
    imeIgrice.value = res.data.naziv_igrice;
    opis.value = res.data.opis;
    if (res.data.datum_izdanja) {
      const dateObj = new Date(res.data.datum_izdanja);
      if (!isNaN(dateObj.getTime())) {
        date.value = dateObj.toISOString().split('T')[0];
      } else {
        // If the date is in dd/mm/yyyy format
        const parts = res.data.datum_izdanja.split('/');
        if (parts.length === 3) {
          date.value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
    }
    developer.value = res.data.id_developera;
    izdavac.value = res.data.id_izdavaca;
    zanr.value = res.data.id_zanra;
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
  };

  async function updateGame ()  {
    try {
    const res = await api.put(`/igrice/${gameId}`, {
      naziv_igrice: imeIgrice.value,
      opis: opis.value,
      datum_izdanja: date.value,
      id_izdavaca: izdavac.value,
      id_developera: developer.value,
      id_zanra: zanr.value,
    });
      console.log(res.data);
      alert("Igrica uspješno spremljena!");
      router.push("/pregled-igrica");
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške pri spremanju!");
    }

    //router.push(`/pregled-igrica`);
  };

  onMounted(() => {
    fetchOptions();
    getGame();
  });
</script>

<style>
  .all{
  width: 1000px; 
  border: 3px solid #1976d2; 
  border-radius: 5px; 
  }
</style>