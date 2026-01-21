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
            {{ game.datum_dodavanja_fmt }} • ⭐ {{ game.ocjena }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
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
import { api } from "boot/axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filters = ref({
  naziv_igrice: "",
  izdavac: null,
  developer: null,
  status: null,
  zanr: null,
  sort: "datum_dodavanja",
});

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
const games = ref([]);

const fetchOptions = async () => {
  const [izdRes, devRes, zanrRes] = await Promise.all([
    api.get("/izdavaci"),
    api.get("/developeri"),
    api.get("/zanrovi"),
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
  const id_korisnika = localStorage.getItem("id_korisnika");

  if (!id_korisnika) {
    console.log("greška pri dohvaćanju igrica.");
    return;
  }

  if (naziv_igrice) params.naziv_igrice = `%${naziv_igrice}%`;
  if (izdavac) params.izdavac = izdavac;
  if (developer) params.developer = developer;
  if (zanr) params.zanr = zanr;
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/lista_igrica/${id_korisnika}?${query}`);
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

const onGameClick = (game) => {
  router.push(`/igrica/${game.id_igrice}`);
};

const onEditButtonClick = (game) => {
  router.push(`/uredivanje-igrice/${game.id_igrice}`);
};

async function onDeleteButtonClick(game) {
  const id_korisnika = localStorage.getItem("id_korisnika");

  if (!id_korisnika) {
    console.log("greška pri brisanju igrice.");
    return;
  }

  await api.delete(`/liste/${id_korisnika}/${game.id_igrice}`);
  fetchGames(
    filters.value.naziv_igrice,
    filters.value.izdavac,
    filters.value.developer,
    filters.value.zanr,
    filters.value.status,
    filters.value.sort,
  );
}

onMounted(() => {
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
