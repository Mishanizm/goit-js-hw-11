import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import { searchImages } from "./api-services";

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    return;
  }

  clearGallery();
  page = 1;
  await performSearch(searchQuery, page);
  showLoadMoreButton();
});

loadMoreBtn.addEventListener("click", async () => {
  const searchQuery = searchForm.elements.searchQuery.value.trim();
  page++;
  await performSearch(searchQuery, page);
});

async function performSearch(query, pageNumber) {
  try {
    const { hits, totalHits } = await searchImages(query, pageNumber);

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    } else {
      renderImages(hits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      if (hits.length < totalHits) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }

      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    Notiflix.Notify.failure("Error fetching images. Please try again later.");
  }
}

function renderImages(images) {
  const lightbox = new SimpleLightbox(".gallery a");
  images.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("photo-card");

    const link = document.createElement("a");
    link.setAttribute("href", image.largeImageURL);
    link.setAttribute("data-lightbox", "gallery");

    const img = document.createElement("img");
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    `;

    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(info);

    gallery.appendChild(card);
  });

  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = "";
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = "block";
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = "none";
}