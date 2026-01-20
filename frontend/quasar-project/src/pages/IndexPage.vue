<template>
  <q-page class="q-pa-lg">
    <!-- Hero sekcija s animacijom pri kliku -->
    <section
      class="hero-section flex flex-center column"
      @click="scrollToInfoSection"
    >
      <div class="row items-center q-gutter-xl">
        <!-- Logo -->
        <q-img
          class="logo"
          src="/images/logo.png"
          style="width: 180px; height: 180px; cursor: pointer"
        />
        <div
          class="text-h1 text-bold"
          @click="scrollToInfoSection"
          style="cursor: pointer"
        >
          GameLenz
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xl">
        <q-btn
          color="primary"
          label="REGISTRACIJA"
          to="/registracija"
          size="lg"
          unelevated
        />
        <q-btn
          color="primary"
          label="PRIJAVA"
          to="/prijava"
          size="lg"
          unelevated
        />
        <q-btn
          color="primary"
          label="PREGLED IGRICA"
          to="/pregled-igrica"
          size="lg"
          unelevated
        />
      </div>

      <div class="q-mt-xl text-subtitle1 text-grey">
        Klikom na logo vidi više!
      </div>
    </section>

    <!-- Opći podaci -->
    <section ref="infoSection" class="second-section q-pa-xl">
      <div class="text-h3 text-bold q-mb-xl">Općeniti podaci</div>

      <div class="row q-col-gutter-xl text-center">
        <div class="col-12 col-md-4">
          <div class="text-h5">Broj igara</div>
          <div class="text-h2 text-primary">{{ statistics.broj_igrica }}</div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj korisnika</div>
          <div class="text-h2 text-primary">
            {{ statistics.broj_korisnika }}
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj ocjena</div>
          <div class="text-h2 text-primary">{{ statistics.broj_ocjena }}</div>
        </div>
      </div>

      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Igra dana</div>

        <q-card class="q-pa-lg">
          <div class="row items-center">
            <q-img
              src="/images/random-game.jpg"
              style="width: 120px; height: 120px"
              class="q-mr-lg"
              contain
            />
            <div>
              <div class="text-h5">{{ statistics.naziv_igrice }}</div>
              <div class="text-body1">{{ statistics.opis }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Formalniji opis stranice -->
      <div class="q-mt-xl text-subtitle1">
        Na ovoj platformi korisnici mogu pregledavati razne igre, povezivati se
        s drugim igračima te ocjenjivati igre na temelju njihovih iskustava i
        preferencija.
      </div>

      <!-- Sekcija za platforme s kojima surađujemo -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">
          Platforme s kojima surađujemo
        </div>
        <div class="row justify-center q-gutter-md">
          <div class="col-3 col-md-2">
            <q-img
              src="/images/platforms/playstation-logo.png"
              alt="PlayStation"
              style="width: 100px; height: auto"
            />
          </div>
          <div class="col-3 col-md-2">
            <q-img
              src="/images/platforms/steam-logo.png"
              alt="Steam"
              style="width: 100px; height: auto"
            />
          </div>
          <div class="col-3 col-md-2">
            <q-img
              src="/images/platforms/xbox-logo.png"
              alt="Xbox"
              style="width: 100px; height: auto"
            />
          </div>
          <div class="col-3 col-md-2">
            <q-img
              src="/images/platforms/nintendo-logo.png"
              alt="Nintendo"
              style="width: 100px; height: auto"
            />
          </div>
        </div>
      </div>

      <!-- Kontakt podrška -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Kontakt podrška</div>
        <p>
          Za bilo kakve upite ili tehničku podršku, slobodno nas kontaktirajte
          na:
        </p>
        <p>
          <q-btn
            color="primary"
            label="support@gamelens.com"
            type="a"
            href="mailto:support@gamelens.com"
            flat
            dense
          />
        </p>
      </div>

      <!-- Često postavljana pitanja -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Često postavljana pitanja</div>
        <div>
          <div class="q-mb-md">
            <strong>Kako mogu registrirati novi račun?</strong>
            <p class="q-mt-xs">
              Da biste registrirali novi račun, jednostavno kliknite na dugme
              "Registracija" na početnoj stranici, unesite svoje podatke i
              slijedite upute.
            </p>
          </div>
          <div class="q-mb-md">
            <strong>Kako ocijeniti igru?</strong>
            <p class="q-mt-xs">
              Ocjenjivanje igre možete obaviti nakon što je igrate. Na stranici
              svake igre ćete vidjeti mogućnost ocjene od 1 do 5 zvjezdica.
            </p>
          </div>
          <div>
            <strong>Kako se povezati s drugim igračima?</strong>
            <p class="q-mt-xs">
              Na platformi možete povezati svoj profil s drugim igračima putem
              naših chat soba ili foruma, gdje možete razgovarati i dogovarati
              zajedničke igre.
            </p>
          </div>
        </div>
      </div>

      <!-- Sva prava pridržana -->
      <div class="q-mt-xl text-center text-grey">
        <p>&copy; 2025 GameLenz. Sva prava pridržana.</p>
      </div>
    </section>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

export default {
  data() {
    return {
      statistics: {
        broj_igrica: 0,
        broj_korisnika: 0,
        broj_ocjena: 0,
        naziv_igrice: "",
        opis: "",
      },
    };
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await api.get("/index-summary");
        this.statistics = response.data;
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    },
    scrollToInfoSection() {
      const infoSection = this.$refs.infoSection;
      if (infoSection) {
        infoSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
  },
};
</script>

<style scoped>
/* KEEP THESE - they are truly custom to this page */
.hero-section {
  height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.second-section {
  min-height: 100vh;
  padding: 30px;
}

/* Utility styles */
.text-subtitle1 {
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
}

.text-h3 {
  word-wrap: break-word;
}
</style>
