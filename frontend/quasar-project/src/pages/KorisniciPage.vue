<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h5 q-mb-md">Pretraga korisnika</div>

    <div class="row q-col-gutter-md items-center">
      <div class="col">
        <q-input filled v-model="korisnicko_ime" label="Upiši korisničko ime" />
      </div>

      <q-btn label="Traži" color="primary" @click="fetchUsers" />
    </div>

    <div class="q-mt-lg q-gutter-md">
      <q-card
        v-for="user in users"
        :key="user.id_korisnika"
        @click="onCardClicked(user.id_korisnika)"
        class="cursor-pointer"
      >
        <q-card-section>
          <div class="text-h6">{{ user.korisnicko_ime }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const korisnicko_ime = ref("");
const router = useRouter();

function onCardClicked(user_id) {
  router.push(`/lista/${user_id}`);
}

const users = ref([]);

const fetchUsers = async () => {
  try {
    const params = { korisnicko_ime: korisnicko_ime.value };
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/korisnici?${query}`);
    users.value = res.data;
  } catch (err) {
    console.error(err);
    users.value = [];
  }
};
</script>
