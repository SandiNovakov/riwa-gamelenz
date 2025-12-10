```
import { api } from 'boot/axios' // pretpostavljamo da imate boot file za Axios

// --- GET ---
async function getUsers() {
  try {
    const res = await api.get('/users')  // GET /users
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}

// --- POST ---
async function createUser() {
  try {
    const res = await api.post('/users', { 
      korisnicko_ime: 'test',
      lozinka: '123'
    })  // POST /users s body
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}

// --- PUT ---
async function updateUser() {
  try {
    const res = await api.put('/users/1', { 
      lozinka: 'novaLozinka'
    })  // PUT /users/:id
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}

// --- DELETE ---
async function deleteUser() {
  try {
    const res = await api.delete('/users/1')  // DELETE /users/:id
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}
```
