<template>
  <q-page padding class="q-pa-lg">
    <div class="text-h5 q-mb-md">
      Dodaj Igrica {{ gameName }}
    </div>
    <q-form @submit="saveGame" class="q-gutter-md" ref="form">
      <q-select
      v-model="form.ocjena"
      :options="ocjenaOptions"
      label="Ocjena"
      />

      <q-select
      v-model="form.status"
      :options="statusOptions"
      label="Status"
       />
      <q-input
      v-model="form.komentar"
      type="textarea"
      label="Komentar"
      />
      <q-btn
      label="Spremi"
      color="primary"
      type="submit"
      class="full-width"
      />
    </q-form>
    
  </q-page>
</template>

<script setup>
//
</script>
