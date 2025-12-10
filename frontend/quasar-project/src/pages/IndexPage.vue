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
          <div class="text-h2 text-primary">134+</div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj korisnika</div>
          <div class="text-h2 text-primary">4,982</div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h5">Broj ocjena</div>
          <div class="text-h2 text-primary">192</div>
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
              <div class="text-h5">Igra123</div>
              <div class="text-grey-5">Kratak opis igre</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Formalniji opis stranice -->
      <div class="q-mt-xl text-grey-4 text-subtitle1">
        Na ovoj platformi korisnici mogu pregledavati razne igre, povezivati se s drugim igračima te ocjenjivati igre na temelju njihovih iskustava i preferencija.
      </div>
    </section>

  </q-page>
</template>

<script>
export default {
  methods: {
    // Funkcija koja scrolla prema sekciji općih podataka
    scrollToInfoSection() {
      const infoSection = this.$refs.infoSection;
      if (infoSection) {
        infoSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
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
}

.text-h1:hover {
  transform: scale(1.1);
}

.second-section {
  min-height: 90vh;
  padding: 30px;
}

.text-h4, .text-h5, .text-h2 {
  color: #fff;
}

.text-grey-4 {
  color: #b0b0b0;
}

.text-subtitle1 {
  font-size: 1.1rem; /* Povećali smo veličinu fonta za lakše čitanje */
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
}

.text-h3 {
  word-wrap: break-word;
}
</style>
