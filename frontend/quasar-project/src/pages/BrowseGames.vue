<template>
  <q-page class="q-pa-md">
    <q-expansion-item
      expand-separator
      label="Filters"
      default-opened
      class="q-mb-md"
    >
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <q-form class="filters-grid">
            <q-input
              filled
              v-model="filters.naziv_igrice"
              label="Naziv igre"
              class="col-12 col-md-4 filters-wide"
            />

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

            <q-select
              filled
              v-model="filters.platforma"
              :options="platforme"
              option-label="naziv_platforme"
              option-value="id_platforme"
              label="Platforma"
              use-input
              input-debounce="300"
              emit-value
              map-options
              class="col-12 col-md"
            />

            <q-input
              filled
              v-model="filters.datum_od"
              type="date"
              label="Datum od"
              class="col-12 col-md"
            />

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

            <q-btn
              label="Apply Filters"
              color="primary"
              class="col-12 col-md-auto"
              @click="applyFilters"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <div class="games-grid">
      <q-card
        v-for="game in games"
        :key="game.id"
        flat
        bordered
        class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer"
        @click="onGameClick(game)"
      >
        <q-card-section>
          <div class="text-h6 q-mb-xs">
            {{ game.naziv_igrice }}
          </div>

          <div class="text-caption text-grey-7 q-mb-sm">
            {{ game.datum_izdanja_fmt }} • ⭐ {{ game.prosjecna_ocjena }}
          </div>

          <div class="text-body2">
            <div><strong>Žanr:</strong> {{ game.zanr }}</div>
            <div><strong>Developer:</strong> {{ game.developer }}</div>
            <div><strong>Izdavač:</strong> {{ game.izdavac }}</div>
            <div><strong>Platforme:</strong> {{ game.platforme }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            icon="add"
            label="Dodaj"
            @click.stop="onGameButtonClick(game)"
            unelevated
            dense
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filters = ref({
  naziv_igrice: "",
  izdavac: null,
  developer: null,
  zanr: null,
  platforma: null,
  datum_od: null,
  datum_do: null,
  sort: "broj_dodavanja_na_listu",
});

const sortOptions = ref([
  { value: "naziv_igrice", label: "Naziv igre" },
  { value: "datum_izdanja", label: "Datum izdavanja" },
  { value: "broj_dodavanja_na_listu", label: "Popularnost" },
  { value: "prosjecna_ocjena", label: "Prosječna ocjena" },
]);

const izdavaci = ref([]);
const developeri = ref([]);
const zanrovi = ref([]);
const platforme = ref([]);
const games = ref([]);

const fetchOptions = async () => {
  const [izdRes, devRes, zanrRes, platRes] = await Promise.all([
    api.get("/izdavaci"),
    api.get("/developeri"),
    api.get("/zanrovi"),
    api.get("/platforme"),
  ]);

  izdavaci.value = [
    { id_izdavaca: null, naziv_izdavaca: "— Sve —" },
    ...izdRes.data,
  ];
  developeri.value = [
    { id_developera: null, naziv_developera: "— Sve —" },
    ...devRes.data,
  ];
  zanrovi.value = [{ id_zanra: null, naziv_zanra: "— Sve —" }, ...zanrRes.data];
  platforme.value = [
    { id_platforme: null, naziv_platforme: "— Sve —" },
    ...platRes.data,
  ];
};

const fetchGames = async (
  naziv_igrice,
  izdavac,
  developer,
  zanr,
  platforma,
  datum_od,
  datum_do,
  sort,
) => {
  const params = {};

  if (naziv_igrice) params.naziv_igrice = `%${naziv_igrice}%`;
  if (izdavac) params.izdavac = izdavac;
  if (developer) params.developer = developer;
  if (zanr) params.zanr = zanr;
  if (platforma) params.platforma = platforma;
  if (datum_od) params.datum_od = datum_od;
  if (datum_do) params.datum_do = datum_do;
  if (sort) params.sort = sort;

  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/browse?${query}`);
  games.value = res.data;
};

const applyFilters = () => {
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.platforma,
    filters.value.datum_od,
    filters.value.datum_do,
    filters.value.sort,
  );
};

const onGameClick = (game) => {
  router.push(`/igrica/${game.id_igrice}`);
};

const onGameButtonClick = (game) => {
  router.push(`/dodavanje-igrice/${game.id_igrice}`);
};

onMounted(() => {
  fetchOptions();
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.platforma,
    filters.value.datum_od,
    filters.value.datum_do,
    filters.value.sort,
  );
});
</script>

<style>
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.filters-wide {
  grid-column: span 2;
}

@media (max-width: 480px) {
  .filters-grid {
    grid-template-columns: 1fr; /* Single column */
    /* OR use smaller minmax */
  }
  .filters-wide {
    grid-column: span 1;
  }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.games-grid q-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
