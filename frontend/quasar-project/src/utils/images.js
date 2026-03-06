import { api } from "boot/axios";

// Returns just the image URL (or null if not found)
export async function getImage(veza_tablica, id_veze, tip_slike) {
  try {
    const res = await api.get("/images", {
      params: { veza_tablica, id_veze, tip_slike },
    });

    // res.data = { mime_type, data (base64) }
    return `data:${res.data.mime_type};base64,${res.data.data}`;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

// Saves image, returns nothing (or ID if you still want it)
export async function saveImage(veza_tablica, id_veze, tip_slike, file) {
  const formData = new FormData();
  formData.append("veza_tablica", veza_tablica);
  formData.append("id_veze", id_veze);
  formData.append("tip_slike", tip_slike);
  formData.append("image", file);

  await api.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Probably won't ever need this, but just in case.
export async function deleteImage(veza_tablica, id_veze, tip_slike) {
  await api.delete("/images", {
    params: { veza_tablica, id_veze, tip_slike },
  });
}
