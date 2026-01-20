<template>
  <q-page padding class="flex justify-center items-start">
      <div class="all row q-py-md justify-center">
          <div class="left column q-py-md q-px-lg col-3">
            <div>
              <q-img class="pic rounded-borders" src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"/>
            </div>

            <div class="q-mt-md q-gutter-md">

            <div class="left-text text-subtitle1">datum: {{ datum }}</div>
            <div class="left-text text-subtitle1">zanr: {{ zanr }}</div>
            <div class="left-text text-subtitle1">Izdavac: {{izdavac}}</div>
            <div class="left-text text-subtitle1">Developer: {{developer}}</div>

            </div>
          </div>
        <div class="right column q-pa-md col-9">
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
    <h1 class="easter-egg">NO</h1>
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
    datum.value = res.data.datum_izdanja_fmt
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

<style>

.left{
  border-right: 1px solid grey;
}

@media (min-width: 470px){

  .all{
  width: 1000px; 
  border: 3px solid #1976d2; 
  border-radius: 5px; 
  }

  .pic{
    height: 250px; max-width: 200px
  }
}
@media (max-width: 470px){

  .left{
  padding-left: 5px;
  padding-right: 5px;
  }

  .right{
    padding-left: 5px;
  }

  .pic{
    height: 200px; max-width: 150px
  }
}
@media (max-width: 400px){

  .pic{
    height: 150px; max-width: 100px
  }

  .left-text{
    font-size: small;
  }
}
@media (max-width: 300px){

  .all{
    display: none;
  }
}
@media (min-width: 300px){

  .easter-egg{
    display: none;
  }
}
</style>
