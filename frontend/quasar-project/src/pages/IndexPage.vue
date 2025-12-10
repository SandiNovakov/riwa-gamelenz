<template>
  <q-page class="bg-dark text-white">

    <section class="hero-section flex flex-center column">

      <div class="row items-center q-gutter-xl">
        <q-img
          src="/images/logo.png"
          class="logo-white"
          style="width: 180px; height: 180px;"
        />

        <div class="text-h1 text-bold">
          GameLenz
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xl">
        <q-btn color="primary" label="REGISTRACIJA" to="/register" size="lg" unelevated />
        <q-btn color="primary" label="LOGIN" to="/login" size="lg" unelevated />
        <q-btn color="primary" label="PREGLED IGRICA" to="/games" size="lg" unelevated />
      </div>

      <div class="q-mt-xl text-grey-6 text-subtitle1">
        Scrollajte za više ↓
      </div>
    </section>

    <section class="second-section q-pa-xl">
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
          <div class="text-h5">Online sada</div>
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
              <div class="text-h5">Random Game Name</div>
              <div class="text-grey-5">Kratak opis igre za test</div>
            </div>
          </div>
        </q-card>
      </div>
    </section>

  </q-page>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  padding: 20px;
}

.logo-white {
  filter: invert(1) brightness(2);
}

.second-section {
  min-height: 100vh;
}
</style>
