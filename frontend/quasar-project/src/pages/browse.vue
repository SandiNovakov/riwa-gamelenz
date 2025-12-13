<template>
  <q-page class="q-pa-md">
    <!-- Top Filters -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <q-form class="row q-gutter-sm">
          <!-- Game Name (most prominent) -->
          <q-input
            filled
            v-model="filters.naziv_igrice"
            label="Naziv igre"
            class="col-12 col-md-4"
          />

          <!-- Publisher -->
          <q-select
            filled
            v-model="filters.izdavac"
            :options="izdavaci"
            option-label="naziv_izdavaca"
            option-value="id_izdavaca"
            label="Izdavač"
            use-input
            input-debounce="300"
            emit-value
            map-options
            class="col-12 col-md"
          />

          <!-- Developer -->
          <q-select
            filled
            v-model="filters.developer"
            :options="developeri"
            option-label="naziv_developera"
            option-value="id_developera"
            label="Developer"
            use-input
            input-debounce="300"
            emit-value
            map-options
            class="col-12 col-md"
          />

          <!-- Genre -->
          <q-select
            filled
            v-model="filters.zanr"
            :options="zanrovi"
            option-label="naziv_zanra"
            option-value="id_zanra"
            label="Žanr"
            use-input
            input-debounce="300"
            emit-value
            map-options
            class="col-12 col-md"
          />

          <!-- Date from -->
          <q-input
            filled
            v-model="filters.datum_od"
            type="date"
            label="Datum od"
            class="col-12 col-md"
          />

          <!-- Date to -->
          <q-input
            filled
            v-model="filters.datum_do"
            type="date"
            label="Datum do"
            class="col-12 col-md"
          />

          <q-select
            filled
            v-model="filters.sort"
            :options="sortOptions"
            option-label="label"
            option-value="value"
            label="Sort by"
            use-input
            input-debounce="300"
            emit-value
            map-options
            class="col-12 col-md"
          />

          <!-- Apply Filters Button -->
          <q-btn
            label="Apply Filters"
            color="primary"
            class="col-12 col-md-auto"
            @click="applyFilters"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Games List -->
    <div class="row q-gutter-md q-col-gutter-md">
      <q-card
        v-for="game in games"
        :key="game.id"
        flat
        bordered
        class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer"
        @click="onGameClick(game)"
      >
        <q-card-section>
          <div class="text-h6">{{ game.naziv_igrice }}</div>
          <div
            class="text-body2 text-ellipsis"
            style="max-height: 3em; overflow: hidden"
          >
            {{ game.opis }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Action"
            @click.stop="onGameButtonClick(game)"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "boot/axios";
import { ref, onMounted } from "vue";

const filters = ref({
  naziv_igrice: '',
  izdavac: null,
  developer: null,
  zanr: null,
  datum_od: null,
  datum_do: null,
  sort: null
})

// Sort dropdown options
const sortOptions = ref([
  { value: 'naziv_igrice', label: 'Naziv igre' },
  { value: 'datum_izdavanja', label: 'Datum izdavanja' },
  { value: 'broj_dodavanja_na_listu', label: 'Popularnost' },
  { value: 'prosjecna_ocjena', label: 'Prosječna ocjena' }
]);

const izdavaci = ref([]);
const developeri = ref([]);
const zanrovi = ref([]);
const games = ref([]);

const fetchOptions = async () => {
  const [izdRes, devRes, zanrRes] = await Promise.all([
    api.get("/izdavaci"),
    api.get("/developeri"),
    api.get("/zanrovi"),
  ]);
  izdavaci.value = izdRes.data;
  developeri.value = devRes.data;
  zanrovi.value = zanrRes.data;
};

const fetchGames = async (
  naziv_igrice,
  izdavac,
  developer,
  zanr,
  datum_od,
  datum_do,
  sort
) => {
  const params = {};

  if (naziv_igrice) params.naziv_igrice = `%${naziv_igrice}%`;
  if (izdavac) params.izdavac = izdavac;
  if (developer) params.developer = developer;
  if (zanr) params.zanr = zanr;
  if (datum_od) params.datum_od = datum_od;
  if (datum_do) params.datum_do = datum_do;
  if (sort) params.sort = sort;
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/browse?${query}`);
  games.value = res.data;
};

// Called when "Apply Filters" button is pressed
const applyFilters = () => {
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.datum_od,
    filters.value.datum_do,
    filters.value.sort
  );
};

const onGameClick = (game) => {
  console.log("Card clicked:", game);
  // navigate or do something when card is clicked
};

const onGameButtonClick = (game) => {
  console.log("Button clicked:", game);
  // separate action for the button
};

onMounted(() => {
  fetchOptions();
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.datum_od,
    filters.value.datum_do,
    filters.value.sort
  ); // load all games initially
});
</script>

<style>
.text-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* show up to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
