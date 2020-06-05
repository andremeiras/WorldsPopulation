/** Initial application state */

let tabCountries = null; // div countries
let tabFavorites = null; // div favorite countries
let allCountries = []; // map() from json fetch()
let favoriteCountries = []; // map() from json fetch()
let countCountries = 0; //
let countFavorites = 0;
let totalPopulationList = 0;
let totalPopulationFavorites = 0;
let numberFormat = null;

window.addEventListener('load', () => {
  /** Mapping DOM */
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');

  // prettier-ignore
  totalPopulationFavorites = 
    document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  /**
   * 1- res receive the fetch('URL')
   * 2- json receive the content of fetch in res with json() function
   * 3- allCountries receive a map() with object destructuring of country
   * 4- object map() receive just the necessary parameters
   * */

  const res = await fetch('http://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    // WITH OBJECT DESTRUCTURING OF COUNTRY
    const { numericCode, translations, population, flag } = country;

    /**
     * WITHOUT OBJECT DESTRUCTURING OF COUNTRY
     * country.name
     * country.translations.pt
     * country.population
     * country.flag
     */

    /** this will just return the parameters that matter for the application at this moment,
     * but the API (RESTCOUNTRIES) has to much parameters
     */
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

/** render() will call the main functions */
function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

/** renderCountryList will show the list of countries from allCountries[] */
function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;

    /** adding HTML with template literals (${PARAMETER}) */
    const countryHTML = `
    <div class='country'> 
      
      <!-- BUTTON -->
      <a id="${id}" class="waves-effect waves-light btn">+</a>

      <!-- FLAG -->
      <img src="${flag}" alt="${name}">
    
      <!-- DETAIL -->
      <ul>  
        <li>${name}</li>
        <li>${formattedPopulation}</li>
      </ul>
    </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

/** renderFavorites will show the list of countries from allCountries[] */
function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;

    const favoriteCountryHTML = `
    <div class='country'>   
      <!-- BUTTON -->
      <a id="${id}" class="waves-effect red darken-4 btn">-</a>

      <!-- FLAG -->
      <img src="${flag}" alt="${name}">
  
      <!-- DETAIL -->
      <ul>  
        <li>${name}</li>
        <li>${formattedPopulation}</li>
      </ul>
    </div>
      `;

    favoritesHTML += favoriteCountryHTML;
    tabFavorites.innerHTML = favoritesHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

// calculate the population with the reduce function
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  favoriteCountries = [...favoriteCountries, countryToAdd];

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find((button) => button.id === id);
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
