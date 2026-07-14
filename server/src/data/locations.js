import { Country, State, City } from 'country-state-city';

export const OTHERS_NICHE_SLUG = 'others';
export const LOCATION_OTHER = '__other__';

export function getCountries() {
  return Country.getAllCountries()
    .map((c) => ({ code: c.isoCode, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getStates(countryCode) {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode)
    .map((s) => ({ code: s.isoCode, name: s.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCities(countryCode, stateCode) {
  if (!countryCode) return [];

  let cities = [];
  if (stateCode) {
    cities = City.getCitiesOfState(countryCode, stateCode) || [];
  } else {
    cities = City.getCitiesOfCountry(countryCode) || [];
  }

  const names = [...new Set(cities.map((c) => c.name).filter(Boolean))];
  names.sort((a, b) => a.localeCompare(b));
  return names;
}

export function getCountryName(code) {
  if (!code) return '';
  return Country.getCountryByCode(code)?.name || code;
}

export function getStateName(countryCode, stateCode) {
  if (!countryCode || !stateCode) return stateCode || '';
  return State.getStateByCodeAndCountry(stateCode, countryCode)?.name || stateCode;
}

export function isValidLocation(country, state, city) {
  if (!country) return false;
  const states = getStates(country);
  if (states.length > 0 && !state) return false;
  if (!city || city.trim().length < 2) return false;
  return true;
}
