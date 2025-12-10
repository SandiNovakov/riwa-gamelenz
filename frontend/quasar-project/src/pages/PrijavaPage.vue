<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px;">

      <div class="text-h5 text-center q-mb-lg">
        Prijava
      </div>

      <q-form @submit="handleLogin">

        <q-input
          v-model="login.username"
          label="Korisničko ime"
          filled
        />

        <q-input
          v-model="login.password"
          label="Lozinka"
          type="password"
          filled
          class="q-mt-md"
        />

        <q-btn
          type="submit"
          label="Registriraj se"
          color="secondary"
          class="q-mt-lg full-width"
        />

      </q-form>

    </q-card>
  </q-page>

</template>