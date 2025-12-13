<template>
  <q-page padding class="flex justify-center items-start">
      <div class="row q-py-md justify-center" style="width: 1000px; border: 3px solid #1976D2; border-radius: 5px;">
          <div class="column q-py-md q-pl-lg col-3" style="border-right: 1px solid grey;">
            <div>
              <q-img class="rounded-borders" src="https://upload.wikimedia.org/wikipedia/en/5/5a/Clair_Obscur%2C_Expedition_33_Cover_1.webp"
              style="height: 250px; max-width: 200px"/>
            </div>

            <div class="q-mt-md q-gutter-md">

            <div class="text-subtitle1">datum: {{ datum }}</div>
            <div class="text-subtitle1">zanr: {{ zanr }}</div>
            <div class="text-subtitle1">Izdavac: {{izdavac}}</div>
            <div class="text-subtitle1">Developer: {{developer}}</div>

            </div>
          </div>
        <div class="column q-pa-md col-9">
          <div class="row justify-between q-mb-md" >
            <div class="column">

              <div class="text-h3 q-mb-md">{{ imeIgrice }}</div>
              <div class="text-subtitle1">Members: {{ dodavanja }}</div>

            </div>

          <div class="text-h4 text-primary q-pr-md">{{ocjena}}</div>

          </div>

          <div class="text-subtitle1 q-mt-xl">{{ opis }}</div>
        </div>
      </div>
  </q-page>
</template>

<script setup>
  import { api } from 'boot/axios'
  import {useRoute} from 'vue-router'
  import {ref, onMounted} from 'vue'

  var imeIgrice = ref("")
  var dodavanja = ref("")
  var ocjena = ref("")
  var datum = ref("")
  var zanr = ref("")
  var opis = ref("")
  var izdavac = ref("")
  var developer = ref("")

  const route = useRoute()
  const gameId = route.params.id

  async function getGame() {
  try {
    const res = await api.get(`/igrice/detalji/${gameId}`)
    console.log(res.data)
    imeIgrice.value = res.data.naziv_igrice
    dodavanja.value = res.data.broj_dodavanja_na_listu
    ocjena.value = res.data.prosjecna_ocjena
    datum.value = res.data.datum_izdanja
    zanr.value = res.data.zanr
    opis.value = res.data.opis
    izdavac.value = res.data.izdavac
    developer.value = res.data.developer
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
    await getGame()
  })

</script>
