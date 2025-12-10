<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="column col-6" style="border: 3px solid red; border-radius: 5px; border-color: red;">
        <div class="row q-px-md q-pt-md">
            <q-img class="q-mr-md rounded-borders col-2" src="https://upload.wikimedia.org/wikipedia/en/5/5a/Clair_Obscur%2C_Expedition_33_Cover_1.webp"
            style="height: 200px; max-width: 150px"/>

            <div class="row justify-between col-9">

              <div class="column">

                <div class="text-h3">Expedition 33</div>
                <div class="text-subtitle1">Members: 34238</div>

              </div>

                <div class="text-h4 text-primary">{{ocjena}}</div>

            </div>
          </div>
          <div class="column justify-left q-px-md">

            <div class="text-subtitle1">
              datum: 10.6.2025
            </div>
            <div class="text-subtitle1">zanr: dsafdf</div>

          </div>
          <div class="row justify-center q-px-md q-py-xl">

            <div class="text-subtitle1">
            opis askjgfsajkdfhaskhfahjksgfjhasgfhjasgdfjgasjhfgjkasdgfhasgdjhfgasdasgsafdgadfgsdfdgasgdfgsddfasdfasgadfhsd
            shjfasjkdgfhkasgfkjasdhfklashdfkjashdfjaskjghaskjdfghaksjdfhjaksdhfgasdsfgsdgsdgsdfdsfgdsgdsfgsdgfhsdfhfsdhjdfg
            </div>

          </div>

          <div class="row justify-evenly q-px-md q-py-xl">

            <div class="text-subtitle1">
              izdavac
            </div>

            <div class="text-subtitle1">
              developer
            </div>

          </div>
        </div>
      </div>
  </q-page>
</template>

<script setup>

  const ocjena = 

  async function getGame() {
  try {
    const res = await api.get('/igrice')  // GET /users
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}
</script>
