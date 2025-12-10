<template>
  <q-page class="bg-dark text-white">
    <!-- Hero sekcija s animacijom pri kliku -->
    <section class="hero-section flex flex-center column" @click="scrollToInfoSection">
      <div class="row items-center q-gutter-xl">
        <!-- Logo -->
        <q-img
          src="/images/logo.png"
          class="logo-white"
          style="width: 180px; height: 180px; cursor: pointer;"
        />
        <div class="text-h1 text-bold" @click="scrollToInfoSection" style="cursor: pointer;">
          GameLenz
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xl">
        <q-btn color="primary" label="REGISTRACIJA" to="/register" size="lg" unelevated />
        <q-btn color="primary" label="LOGIN" to="/login" size="lg" unelevated />
        <q-btn color="primary" label="PREGLED IGRICA" to="/games" size="lg" unelevated />
      </div>

      <div class="q-mt-xl text-grey-6 text-subtitle1">
        Klikom na logo vidi više!
      </div>
    </section>

    <!-- Opći podaci -->
    <section ref="infoSection" class="second-section q-pa-xl">
      <div class="text-h3 text-bold q-mb-xl">
        Općeniti podaci
      </div>

      <div class="row q-col-gutter-xl text-center">
        <div class="col-12 col-md-4">
          <div class="text-h5">Broj igara</div>
          <div class="text-h2 text-primary">{{ statistics.broj_igrica }}</div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj korisnika</div>
          <div class="text-h2 text-primary">{{ statistics.broj_korisnika }}</div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj ocjena</div>
          <div class="text-h2 text-primary">{{ statistics.broj_ocjena }}</div>
        </div>
      </div>

      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Igra dana</div>

        <q-card class="q-pa-lg bg-grey-9">
          <div class="row items-center">
            <q-img
              src="/images/random-game.jpg"
              style="width: 120px; height: 120px;"
              class="q-mr-lg"
              contain
            />
            <div>
              <div class="text-h5">{{ statistics.naziv_igrice }}</div>
              <div class="text-grey-5">{{ statistics.opis }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Formalniji opis stranice -->
      <div class="q-mt-xl text-grey-4 text-subtitle1">
        Na ovoj platformi korisnici mogu pregledavati razne igre, povezivati se s drugim igračima te ocjenjivati igre na temelju njihovih iskustava i preferencija.
      </div>

      <!-- Sekcija za platforme s kojima surađujemo -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Platforme s kojima surađujemo</div>
        <div class="row justify-center q-gutter-md">
          <div class="col-3 col-md-2">
            <q-img src="/images/platforms/playstation-logo.png" alt="PlayStation" style="width: 100px; height: auto;" />
          </div>
          <div class="col-3 col-md-2">
            <q-img src="/images/platforms/steam-logo.png" alt="Steam" style="width: 100px; height: auto;" />
          </div>
          <div class="col-3 col-md-2">
            <q-img src="/images/platforms/xbox-logo.png" alt="Xbox" style="width: 100px; height: auto;" />
          </div>
          <div class="col-3 col-md-2">
            <q-img src="/images/platforms/nintendo-logo.png" alt="Nintendo" style="width: 100px; height: auto;" />
          </div>
        </div>
      </div>

      <!-- Kontakt podrška -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Kontakt podrška</div>
        <p class="text-grey-4">Za bilo kakve upite ili tehničku podršku, slobodno nas kontaktirajte na:</p>
        <p><a href="mailto:support@gamelens.com" class="text-primary">support@gamelens.com</a></p>
      </div>

      <!-- Često postavljana pitanja -->
      <div class="q-mt-xl">
        <div class="text-h4 text-bold q-mb-md">Često postavljana pitanja</div>
        <div class="text-grey-4">
          <div>
            <strong>Kako mogu registrirati novi račun?</strong>
            <p>Da biste registrirali novi račun, jednostavno kliknite na dugme "Registracija" na početnoj stranici, unesite svoje podatke i slijedite upute.</p>
          </div>
          <div>
            <strong>Kako ocijeniti igru?</strong>
            <p>Ocjenjivanje igre možete obaviti nakon što je igrate. Na stranici svake igre ćete vidjeti mogućnost ocjene od 1 do 5 zvjezdica.</p>
          </div>
          <div>
            <strong>Kako se povezati s drugim igračima?</strong>
            <p>Na platformi možete povezati svoj profil s drugim igračima putem naših chat soba ili foruma, gdje možete razgovarati i dogovarati zajedničke igre.</p>
          </div>
        </div>
      </div>

      <!-- Sva prava pridržana -->
      <div class="q-mt-xl text-center text-grey-4">
        <p>&copy; 2025 GameLenz. Sva prava pridržana.</p>
      </div>

    </section>

  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      statistics: {
        broj_igrica: 0,
        broj_korisnika: 0,
        broj_ocjena: 0,
        naziv_igrice: '',
        opis: ''
      }
    };
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await axios.get('http://localhost:3000/index-summary');
        this.statistics = response.data;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
    scrollToInfoSection() {
      const infoSection = this.$refs.infoSection;
      if (infoSection) {
        infoSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }
};
</script>

<style scoped>
.hero-section {
  height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logo-white {
  filter: invert(1) brightness(2);
  transition: transform 0.3s ease;
}

.logo-white:hover {
  transform: scale(1.1);
}

.text-h1 {
  cursor: pointer;
  transition: transform 0.3s ease;
  font-size: 3rem;
}

.text-h1:hover {
  transform: scale(1.1);
}

.second-section {
  min-height: 100vh;
  padding: 30px;
}

.text-h4, .text-h5, .text-h2 {
  color: #fff;
}

.text-grey-4 {
  color: #b0b0b0;
}

.text-subtitle1 {
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
}

.text-h3 {
  word-wrap: break-word;
}

.text-primary {
  color: #1e88e5;
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}

.row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
