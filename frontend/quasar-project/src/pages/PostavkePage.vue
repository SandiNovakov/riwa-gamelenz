<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px">
      <div class="text-h5 text-center q-mb-lg">Postavke računa</div>

      <q-form @submit="novalozinka">
        <q-input
          v-model="register.korisnicko_ime"
          label="Korisničko ime"
          filled
          :rules="[(val) => !!val || 'Korisničko ime je obavezno']"
        />

        <q-input
          v-model="register.novalozinka"
          label="Nova lozinka"
          type="password"
          filled
          class="q-mt-md"
          hint="Ostavite prazno ako ne želite mijenjati lozinku"
        />

        <q-input
          v-model="register.potvrdalozinka"
          label="Potvrda lozinke"
          type="password"
          filled
          class="q-mt-md"
          :rules="[(val) => !register.novalozinka || val === register.novalozinka || 'Lozinke se ne podudaraju',]"
        />

        <q-input
          v-model="register.email"
          label="Email"
          type="email"
          filled
          class="q-mt-md"
          :rules="[(val) => !!val || 'Email je obavezan']"
        />

        <q-checkbox
          v-model="register.privatni_racun"
          label="Ovo je privatni račun"
          class="q-mt-lg"
        />

        <q-btn
          type="submit"
          label="Spremi promjene"
          color="warning"
          class="q-mt-lg full-width"
        />

        <q-btn
          type="button"
          label="Obriši račun"
          color="negative"
          class="q-mt-md full-width"
          @click="confirmDelete"
        />
      </q-form>
    </q-card>
  </q-page>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const idKorisnika = localStorage.getItem("id_korisnika");

const register = ref({
  korisnicko_ime: "",
  email: "",
  privatni_racun: false,
  novalozinka: "",
  potvrdalozinka: "",
});

/* učitavaju se podaci da ih mi ne moramo pisati */
onMounted(async () => {
  if (!idKorisnika) return;

  const res = await api.get(`/korisnici/${idKorisnika}`);
  register.value.korisnicko_ime = res.data.korisnicko_ime;
  register.value.email = res.data.email;
  register.value.privatni_racun = res.data.privatni_racun;
});

/* ovdje se spremaju promjene kada mijenjamo postavke računa*/
async function novalozinka() {
  try {
    const payload = {
      korisnicko_ime: register.value.korisnicko_ime,
      email: register.value.email,
      privatni_racun: register.value.privatni_racun,
    };

    if (register.value.novalozinka) {
      payload.lozinka = register.value.novalozinka;
    }

    await api.put(`/korisnici/${idKorisnika}`, payload);

    const redirect = route.query.redirect;
    router.push(redirect || "/");
  } catch (err) {
    console.error("API ERROR:", err);
  }
}

function confirmDelete() {
  $q.dialog({
    title: "Upozorenje!",
    message: "Jeste li sigurni da želite obrisati račun?",
    ok: {
      label: "Da, obriši",
      color: "negative",
    },
    cancel: {
      label: "Ne",
      flat: true,
    },
    persistent: true,
  })
    .onOk(deleteAccount)
    .onCancel(() => {
      router.push("/lista");
    });
}

/* BRISANJE RAČUNA */
async function deleteAccount() {
  if (!idKorisnika) return;

  try {
    await api.delete(`/korisnici/${idKorisnika}`);
    localStorage.removeItem("id_korisnika");
    router.push("/");
  } catch (err) {
    console.error("Greška pri brisanju računa:", err);
  }
}
</script>
