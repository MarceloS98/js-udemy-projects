const form = document.querySelector("#buscador");
const selectInputs = form.querySelectorAll("select");
const resultsContainer = document.querySelector("#resultado");
const yearSelect = form.querySelector("#year");

let filteredCars = [];
let filterValues = {};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  createOptions();
  renderResults();
}

selectInputs.forEach((select) => {
  select.addEventListener("change", filterCars);
});

function filterCars(e) {
  filterValues[e.target.id] = e.target.value;

  let valuesAreEmpty = Object.values(filterValues).every(
    (filter) => filter == ""
  );

  if (valuesAreEmpty) {
    renderResults();
  } else {
    filteredCars = autos.filter((auto) => {
      let match;

      for (let key in auto) {
        match = true;
        console.log(filterValues[""]);
        // Si el valor de la llave en filterValue es un empty string, continua al siguiente key (ignora, sigue siendo true el match)
        if (filterValues[key] == "") continue;

        // El precio validamos de una forma especial ya que es con base en un rango. Si es falso y es distinto a undefined (se seleccionó un rango), retorna false. Sino guarda el valor de match y continua al siguiente key
        if (key == "precio") {
          match = filterByPrice(auto, key);
          if (!match && match != undefined) return false;
          continue;
        }

        // Validamos que sea distinto a undefined tambien porque hay keys en el auto que no se aplican a los filtros, lo cual va a causar que siempre exista una iteracion que retorne un 'falso falso'
        if (filterValues[key] != undefined && filterValues[key] != auto[key]) {
          return false;
        }
      }
      return match;
    });

    renderResults(valuesAreEmpty);
  }
}

function filterByPrice(auto, key) {
  let min = form.querySelector("#minimo").value;
  let max = form.querySelector("#maximo").value;
  if (min && !max) {
    return auto[key] >= min;
  } else if (!min && max) {
    return auto[key] <= max;
  } else if (min && max) {
    return auto[key] >= min && auto[key] <= max;
  }
}

function createOptions() {
  let years = [];
  autos.forEach((auto) => {
    if (!years.includes(auto["year"])) {
      years.push(auto["year"]);
    }
  });
  years.sort();
  years.forEach((year) => {
    let option = document.createElement("option");
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

function renderResults(valuesAreEmpty = true) {
  let results;
  valuesAreEmpty ? (results = autos) : (results = filteredCars);
  resultsContainer.innerHTML = "";
  results.forEach((result) => {
    let p = document.createElement("p");
    let resultEntries = Object.entries(result);
    let formattedInfo = resultEntries.map((i) => i.join(": "));
    formattedInfo = formattedInfo.join(" - ");
    p.textContent = formattedInfo;
    resultsContainer.appendChild(p);
  });
}
