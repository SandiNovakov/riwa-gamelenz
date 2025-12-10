<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px;">

      <div class="text-h5 text-center q-mb-lg">
        Registracija
      </div>

      <q-form @submit="handleRegister">

        <q-input
          v-model="register.username"
          label="Korisničko ime"
          filled
        />

        <q-input
          v-model="register.email"
          label="Email"
          type="email"
          filled
          class="q-mt-md"
        />

        <q-input
          v-model="register.password"
          label="Lozinka"
          type="password"
          filled
          class="q-mt-md"
        />

        <q-checkbox
          v-model="register.privateAccount"
          label="Ovo je privatni račun"
          class="q-mt-lg"
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

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'

const register = ref({
  username: '',
  email: '',
  password: '',
  privateAccount: false  
})

async function handleRegister () {
  await createUser()
}

async function createUser() {
  try {
    const res = await api.post('/korisnik', register.value)
    console.log("Korisnik kreiran:", res.data)
  } catch(err) {
    console.error("API ERROR:", err)
  }
}
</script>
