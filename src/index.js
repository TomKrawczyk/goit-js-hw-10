import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function renderCountryList(countries) {
  const listItems = countries.map((country) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<img src="${country.flags.svg}" alt="${country.name.official}" /> ${country.name.official}`;
    listItem.addEventListener('click', () => renderCountryInfo(country));
    return listItem;
  });
  clearUI();
  countryList.append(...listItems);
}

function renderCountryInfo(country) {
  const countryDetails = `
    <div class="country-info">
      <img src="${country.flags.png}" alt="${country.name.common}" />
      <h2>${country.name.common}</h2>
      <p><b>Capital:</b> ${country.capital}</p>
      <p><b>Population:</b> ${country.population}</p>
      <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>
    </div>
  `;
  clearUI();
  countryInfo.innerHTML = countryDetails;
}

function clearUI() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onSearchInput() {
  const searchValue = searchInput.value.trim();
  if (searchValue === '') {
    clearUI();
    return;
  }

  fetchCountries(searchValue)
    .then((countries) => {
      clearUI();
      if (!countries) {
        return Notiflix.Notify.failure('Oops, there is no country with that name.');
      }

      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
        return;
      }

      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      }
    })
    .catch((error) => {
      Notiflix.Notify.failure('An error occurred while fetching data.');
      console.error(error);
    });
}
searchInput.addEventListener('input', debounce(onSearchInput, 300));