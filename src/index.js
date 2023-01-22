import { getImages } from "./getImages";
import { createMarkup } from "./createMarkup";
import { endOfSearch, onSearchError, onSearchSuccess } from "./Notifications"
import { onScrollBtnUp, btnUpToTop } from "./scrollBtnToTop"
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let query = '';
let page = 1;
let perPage = 40;
let simplelightbox = new SimpleLightbox('.gallery a')

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', addImages);
onScrollBtnUp();
btnUpToTop();

function onSearch(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  query = evt.currentTarget.elements.searchQuery.value.trim();
  
  getImages(query, page, perPage).then(({ data }) => {

    if (!query || !data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      onSearchError();
      return
    } else if (data.totalHits <= 40) {
      onSearchSuccess(data);
      createMarkup(data.hits);
      loadMoreBtn.classList.add('hidden');
      simplelightbox.refresh();
    } else {
      onSearchSuccess(data);
      createMarkup(data.hits);
      loadMoreBtn.classList.remove('hidden');
      simplelightbox.refresh();
    }
  }).catch(error => console.log(error))
}

function addImages() {
    page += 1;
    getImages(query, page, perPage)
      .then(({ data }) => {
        createMarkup(data.hits);
        simplelightbox.refresh();
        const totalPages = Math.ceil(data.totalHits / perPage);
        console.log(page)
        if (page >= totalPages) {
          loadMoreBtn.classList.add('hidden');
          endOfSearch();
        }
      })
      .catch(error => console.log(error));
  }