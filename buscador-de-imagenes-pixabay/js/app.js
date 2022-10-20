import { API_KEY } from "./api-key.js";

const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");
const pagination = document.querySelector("#paginacion");

// Define la cantidad de imagenes que van a mostrarse por pag
const imagesPerPage = 40;
// Define la pag que se muestra
let currentPage = 1;

formulario.addEventListener("submit", validateForm);
// Se aprovecha del capturing para que todos los botones de la paginacion ejecuten la funcion goToPage()
pagination.addEventListener("click", goToPage);

// Validate form
function validateForm(e) {
  e.preventDefault();

  const searchTerm = form.querySelector("#termino").value;

  if (searchTerm === "") {
    showError("Agrega un término de búsqueda");
  } else {
    searchImages();
  }
}

// Fetch a la API
function searchImages() {
  const searchTerm = form.querySelector("#termino").value;

  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchTerm}&page=${currentPage}`;

  fetch(URL)
    .then((result) => result.json())
    .then((data) => {
      generateResults(data.hits);
      displayPages(data);
    });
}

// Genera todas cards de las imagenes que encuentra
function generateResults(data) {
  // Caso en el que ya existe un resultado
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  // Generate HTML
  data.forEach((item) => {
    const { previewURL, tags, likes, views, largeImageURL } = item;

    const div = document.createElement("div");
    div.className = "w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3";
    div.innerHTML = `
      <div class="bg-white">
        <img class="w-full" src="${previewURL}" alt="${tags}">
        <div class="p-4">
            <p class="card-text">${likes} Me Gusta</p>
            <p class="card-text">${views} Vistas </p>
            <a href="${largeImageURL}" rel="noopener noreferrer" target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
        </div>
      </div>
    `;

    result.appendChild(div);
  });
}

// Genera la paginacion (UI). La funcionalidad se agrega en goToPage()
function displayPages(data) {
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  // Calculate total pages
  let totalPages = Math.ceil(data.totalHits / imagesPerPage);

  let nextIterator = createPages(totalPages);

  while (true) {
    const { value, done } = nextIterator.next();

    if (done) return;

    const a = document.createElement("a");
    a.dataset.pagina = value;
    a.setAttribute("href", "#");
    a.className =
      "siguiente bg-yellow-400 px-4 py-1 mr-2 mx-auto mb-10 font-bold uppercase rounded";
    a.textContent = value;

    pagination.append(a);
  }
}

// Generador que sirve para crear todas las pags segun el calculo del total de resultados con la cantidad de imagenes mostradas por pagina
function* createPages(totalPages) {
  for (let i = 1; i <= totalPages; i++) {
    yield i;
  }
}

// Si el target del click contiene la clase 'siguiente', agarra el valor de su dataset, lo pone como currentPage y corre searchImage para renderizar todas las imagenes de esa pag
function goToPage(e) {
  if (e.target.classList.contains("siguiente")) {
    currentPage = Number(e.target.dataset.pagina);
    searchImages();
    formulario.scrollIntoView();
  }
}

// Muestra el mensaje de error si el formulario esta vacio
function showError(error) {
  const alertExist = document.querySelector(".bg-red-100");

  if (!alertExist) {
    const alert = document.createElement("div");
    alert.className =
      "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative w-full mx-auto mt-6 text-center";

    const html = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${error}</span>
        `;

    alert.innerHTML = html;

    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
}
