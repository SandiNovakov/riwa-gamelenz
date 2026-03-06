import { api } from "boot/axios";

// You can still keep the function separate
export async function fetchImages(veza_tablica, id_veze, tip_slike = null) {
  try {
    // First call - get IDs
    const params = { veza_tablica, id_veze };
    if (tip_slike) params.tip_slike = tip_slike;

    const { data: ids } = await api.get("/images", { params });

    if (!ids.length) return [];

    // Second call - get each image
    const imagePromises = ids.map(async (id) => {
      const response = await api.get(`/images/${id}`, {
        responseType: "blob",
      });

      return {
        id,
        url: URL.createObjectURL(response.data),
        mime_type: response.headers["content-type"],
      };
    });

    return await Promise.all(imagePromises);
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}

// Helper for cleanup
export function revokeImageUrls(images) {
  if (!images) return;

  // Handle single object
  if (!Array.isArray(images)) {
    images = [images];
  }

  images.forEach((img) => {
    if (img?.url) URL.revokeObjectURL(img.url);
  });
}
