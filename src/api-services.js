// api-services.js
import axios from "axios";

export async function searchImages(query, pageNumber) {
  const response = await axios.get("https://pixabay.com/api/", {
    params: {
      key: "40755274-d9726296ed4dd82e44d7fe7af",
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: pageNumber,
      per_page: 40,
    },
  });

  const { hits, totalHits } = response.data;
  return { hits, totalHits };
}
