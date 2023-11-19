import axios from "axios";

export async function searchImages(query, page) {
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: encodeURIComponent("40755274-d9726296ed4dd82e44d7fe7af"),
        q: encodeURIComponent(query),
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}