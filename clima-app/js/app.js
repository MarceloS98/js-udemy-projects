import { API_KEY } from "./api-key.js";

const container = document.querySelector(".container");
const result = document.querySelector("#resultado");
const form = document.querySelector("#formulario");

form.addEventListener("submit", requestWeather);

function requestWeather(e) {
  e.preventDefault();

  // Grab form values
  const city = form.querySelector("#ciudad").value;
  const country = form.querySelector("#pais").value;

  // Validate form
  if (city == "" || country == "") {
    showError("Ambos campos son obligatorios");
  } else {
    // Validates that the temp div doesn't already exists
    const weatherDiv = result.querySelector("div.weather");
    console.log(weatherDiv);
    if (weatherDiv) weatherDiv.remove();

    // Removes the placeholder p
    const p = result.querySelector("p");
    if (p) p.remove();

    // Show spinner
    const spinner = result.querySelector(".sk-fading-circle");
    spinner.classList.toggle("hidden");

    // Gets the latitude and longitude of the required city
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${API_KEY}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          showError("Ciudad no encontrada");
          spinner.classList.toggle("hidden");
        } else {
          getWeather(data, spinner);
        }
      });
  }
}

// Use the lat and lon to get the weather
function getWeather(data, spinner) {
  const { lat, lon, name } = data[0];

  // Fetch the data
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(URL)
    .then((response) => response.json())
    .then((data) => showWeather(data, name, spinner));
}

// Display the information in the UI
function showWeather(data, name, spinner) {
  const { temp, temp_max, temp_min } = data.main;
  const tempData = [temp, temp_max, temp_min];

  let celsiusTemp = kelvinToCelsius(tempData);

  // Starts creating the weather UI
  const div = document.createElement("div");

  const html = `
    <div class="weather text-center text-white">
      <p class="font-bold text-2xl">Clima en ${name}</p>
      <p class="font-bold text-6xl">${celsiusTemp[0]} ℃</p>
      <p class="text-xl">Max: ${celsiusTemp[1]} ℃</p>
      <p class="text-xl">Min: ${celsiusTemp[2]} ℃</p>
    </div>
  `;

  div.innerHTML = html;

  // Hide the spinner before appending the div
  spinner.classList.toggle("hidden");

  result.appendChild(div);
}

// Recieves an array of all kevin temp and converts them to celsius
function kelvinToCelsius(tempData) {
  let celsiusTemp = tempData.map((temp) => Math.round(temp - 273.15));
  return celsiusTemp;
}

// Display error message
function showError(error) {
  const alert = container.querySelector("div.bg-red-100");

  if (!alert) {
    const alert = document.createElement("div");
    alert.className =
      "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-6 text-center";

    const html = `
					<strong class="font-bold">Error!</strong>
					<span class="block sm:inline">${error}</span>
			`;

    alert.innerHTML = html;

    container.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
}
