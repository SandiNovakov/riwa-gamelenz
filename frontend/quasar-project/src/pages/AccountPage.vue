<template>
  <q-page class="q-pa-md">
    <!-- User info section -->
    <q-card flat class="q-mb-md">
      <q-card-section class="row items-center justify-between">
        <div class="col">
          <div class="text-h3">{{ korisnik.korisnicko_ime }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            v-if="currentUserId === korisnik.id_korisnika"
            icon="settings"
            color="primary"
            label="Postavke računa"
            @click="onPostavkeButtonClick"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-expansion-item
      expand-separator
      label="Filteri"
      default-closed
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
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              label="Status"
              use-input
              input-debounce="300"
              emit-value
              map-options
              class="col-12 col-md"
            />

            <q-select
              filled
              v-model="filters.sort"
              :options="sortOptions"
              option-label="label"
              option-value="value"
              label="Sortiranje"
              use-input
              input-debounce="300"
              emit-value
              map-options
              class="col-12 col-md"
            />

            <q-btn
              label="Primjeni filtere"
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
            {{ game.datum_dodavanja_fmt }} • ⭐ {{ game.ocjena }}
          </div>

          <div
            class="q-mt-xs"
            :class="[getStatusColor(game.status), 'text-weight-bold']"
          >
            {{ game.status }}
          </div>
        </q-card-section>
        <q-card-actions
          align="right"
          v-if="currentUserId === korisnik.id_korisnika"
        >
          <q-btn
            icon="mode_edit"
            color="primary"
            dense
            flat
            round
            @click.stop="onEditButtonClick(game)"
          >
            <q-tooltip>Edit Game</q-tooltip>
          </q-btn>

          <q-btn
            icon="delete"
            color="negative"
            dense
            flat
            round
            @click.stop="onDeleteButtonClick(game)"
          >
            <q-tooltip>Delete Game</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

// Router and external utilities
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Reactive data
const korisnik = ref([]);
const games = ref([]);

// Filter data
const filters = ref({
  naziv_igrice: "",
  izdavac: null,
  developer: null,
  status: null,
  zanr: null,
  sort: "datum_dodavanja",
});

// Options for selects
const sortOptions = ref([
  { value: "naziv_igrice", label: "Naziv igre" },
  { value: "datum_dodavanja", label: "Datum dodavanja na listu" },
  { value: "ocjena", label: "Ocjena" },
]);

const statusOptions = ref([
  { label: "Planirano", value: "planirano" },
  { label: "Igram", value: "igram" },
  { label: "Završeno", value: "završeno" },
  { label: "Odustao", value: "odustao" },
]);

const izdavaci = ref([]);
const developeri = ref([]);
const zanrovi = ref([]);

// Computed properties
const currentUserId = computed(() => {
  return Number(localStorage.getItem("id_korisnika"));
});

// Helper functions
function getStatusColor(status) {
  if (!status) {
    return "text-black";
  }
  const colors = {
    planirano: "text-grey", // Blue for planned
    igram: "text-green", // Green for playing
    završeno: "text-blue", // Positive green for completed
    odustao: "text-negative", // Negative red for dropped
  };
  return colors[status] || "grey";
}

// Data fetching functions
async function getKorisnik() {
  const res = await api.get(`/korisnici/${route.params.id}`);
  korisnik.value = res.data;
}

const fetchOptions = async () => {
  // privremene varijable za opcije...
  const [izdRes, devRes, zanrRes] = await Promise.all([
    api.get("/izdavaci"),
    api.get("/developeri"),
    api.get("/zanrovi"),
  ]);

  // ovdje se nadodaje default opcija i onda je to konacna vrijednost.
  izdavaci.value = [
    { id_izdavaca: null, naziv_izdavaca: "— Sve —" },
    ...izdRes.data,
  ];
  developeri.value = [
    { id_developera: null, naziv_developera: "— Sve —" },
    ...devRes.data,
  ];
  zanrovi.value = [{ id_zanra: null, naziv_zanra: "— Sve —" }, ...zanrRes.data];
};

const fetchGames = async (
  naziv_igrice,
  izdavac,
  developer,
  zanr,
  status,
  sort,
) => {
  const params = {};

  if (naziv_igrice) params.naziv_igrice = `%${naziv_igrice}%`;
  if (izdavac) params.izdavac = izdavac;
  if (developer) params.developer = developer;
  if (zanr) params.zanr = zanr;
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const query = new URLSearchParams(params).toString();
  const res = await api.get(
    `/lista_igrica/${korisnik.value.id_korisnika}?${query}`,
  );
  games.value = res.data;
};

const applyFilters = () => {
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.status,
    filters.value.sort,
  );
};

// Event handlers
const onGameClick = (game) => {
  router.push(`/igrica/${game.id_igrice}`);
};

const onEditButtonClick = (game) => {
  router.push({
    path: `/uredivanje-igrice/${game.id_igrice}`,
    query: { redirect: router.currentRoute.value.path },
  });
};

function onPostavkeButtonClick() {
  router.push("/upravljanje-racunom");
}

async function onDeleteButtonClick(game) {
  $q.dialog({
    title: "Upozorenje!",
    message: "Jeste li sigurni da želite obrisati igricu?",
    ok: {
      label: "Da, obriši",
      color: "negative",
    },
    cancel: {
      label: "Ne",
      flat: true,
    },
    persistent: true,
  }).onOk(() => removeGame(game));
}

async function removeGame(game) {
  await api.delete(`/liste/${korisnik.value.id_korisnika}/${game.id_igrice}`);
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.status,
    filters.value.sort,
  );
}

// Lifecycle hooks
onMounted(async () => {
  await getKorisnik();
  fetchOptions();
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.status,
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
