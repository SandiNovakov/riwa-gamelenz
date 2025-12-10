<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h5 q-mb-md">Dodaj {{ gameName }}</div>

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

      <q-input
        filled
        v-model="komentar"
        type="textarea"
        label="Komentar"
      />

      <q-btn label="Spremi" color="primary" @click="saveGame" class="full-width" />
    </div>

    <!-- prikaz vrijednosti radi provjere -->
    <div class="q-mt-lg">
      <pre>{{ users }}</pre>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
const ocjena = ref("")
const status = ref('planirano')
const komentar = ref("")
const gameName = ref("Učitavanje...")
const users = ref([])

const route = useRoute()
const gameId = route.params.id




const getGameName = async () => {
  try {
    const res = await api.get(`/igrice/${gameId}`) // GET /users
    gameName.value = res.data.naziv_igrice
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}

// poziv obje funkcije kad se stranica učita
onMounted(async () => {
  await getGameName()
  
})

const ocjenaOptions = [
  { label: 'Bez ocjene', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 }
]

const statusOptions = [
  { label: 'Planirano', value: 'planirano' },
  { label: 'Igram', value: 'igram' },
  { label: 'Završeno', value: 'završeno' }
]

const saveGame = () => {
  console.log('FORMA:', ocjena.value, status.value, komentar.value)
  alert('Forma poslana! Pogledaj console.')
}
</script>
