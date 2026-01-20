<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px;">

      <div class="text-h5 text-center q-mb-lg">
        Prijava
      </div>

      <q-form @submit="handleLogin">

        <q-input
          v-model="login.korisnicko_ime"
          label="Korisničko ime"
          filled
          :rules="[val => !!val || 'Korisničko ime je obavezno']"
        />

        <q-input
          v-model="login.lozinka"
          label="Lozinka"
          type="password"
          filled
          class="q-mt-md"
          :rules="[val => !!val || 'Lozinka je obavezna']"
        />

        <q-btn
          type="submit"
          label="Prijava"
          color="secondary"
          class="q-mt-lg full-width"
        />

      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'

const login = ref({
  korisnicko_ime: '',
  lozinka: ''
})

async function handleLogin () {
  await loginUser()
}

async function loginUser () {
  try {
    const res = await api.post('/login', login.value)
    console.log('ID korisnika: ', res.data.id_korisnika)
    localStorage.setItem('id_korisnika', res.data.id_korisnika)
  } catch (err) {
    console.error('Greška u pisanju', err)
  }
}
</script>
