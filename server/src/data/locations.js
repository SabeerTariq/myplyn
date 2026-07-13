export const OTHERS_NICHE_SLUG = 'others';
export const LOCATION_OTHER = '__other__';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'TR', name: 'Turkey' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
];

const STATES = {
  US: [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington D.C.' },
  ],
  CA: [
    { code: 'ON', name: 'Ontario' }, { code: 'QC', name: 'Quebec' }, { code: 'BC', name: 'British Columbia' },
    { code: 'AB', name: 'Alberta' }, { code: 'MB', name: 'Manitoba' }, { code: 'SK', name: 'Saskatchewan' },
    { code: 'NS', name: 'Nova Scotia' }, { code: 'NB', name: 'New Brunswick' },
  ],
  GB: [
    { code: 'ENG', name: 'England' }, { code: 'SCT', name: 'Scotland' },
    { code: 'WLS', name: 'Wales' }, { code: 'NIR', name: 'Northern Ireland' },
  ],
  AE: [
    { code: 'DXB', name: 'Dubai' }, { code: 'AUH', name: 'Abu Dhabi' }, { code: 'SHJ', name: 'Sharjah' },
    { code: 'AJM', name: 'Ajman' }, { code: 'RAK', name: 'Ras Al Khaimah' }, { code: 'FUJ', name: 'Fujairah' },
    { code: 'UAQ', name: 'Umm Al Quwain' },
  ],
  SA: [
    { code: 'RIY', name: 'Riyadh' }, { code: 'MKK', name: 'Makkah' }, { code: 'MED', name: 'Madinah' },
    { code: 'ESH', name: 'Eastern Province' }, { code: 'ASR', name: 'Asir' },
  ],
  AU: [
    { code: 'NSW', name: 'New South Wales' }, { code: 'VIC', name: 'Victoria' }, { code: 'QLD', name: 'Queensland' },
    { code: 'WA', name: 'Western Australia' }, { code: 'SA', name: 'South Australia' },
  ],
  IN: [
    { code: 'MH', name: 'Maharashtra' }, { code: 'DL', name: 'Delhi' }, { code: 'KA', name: 'Karnataka' },
    { code: 'TN', name: 'Tamil Nadu' }, { code: 'GJ', name: 'Gujarat' },
  ],
  PK: [
    { code: 'PB', name: 'Punjab' }, { code: 'SD', name: 'Sindh' }, { code: 'KP', name: 'Khyber Pakhtunkhwa' },
    { code: 'IS', name: 'Islamabad' },
  ],
  EG: [
    { code: 'C', name: 'Cairo' }, { code: 'ALX', name: 'Alexandria' }, { code: 'GZ', name: 'Giza' },
  ],
};

const CITIES = {
  'US:CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno'],
  'US:NY': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'US:TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
  'US:FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  'US:IL': ['Chicago', 'Aurora', 'Naperville', 'Springfield'],
  'US:WA': ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'],
  'US:MA': ['Boston', 'Cambridge', 'Worcester', 'Springfield'],
  'US:GA': ['Atlanta', 'Savannah', 'Augusta', 'Columbus'],
  'US:NV': ['Las Vegas', 'Reno', 'Henderson'],
  'US:CO': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'],
  'US:DC': ['Washington'],
  'CA:ON': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
  'CA:QC': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
  'CA:BC': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
  'CA:AB': ['Calgary', 'Edmonton', 'Red Deer'],
  'GB:ENG': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol'],
  'GB:SCT': ['Edinburgh', 'Glasgow', 'Aberdeen'],
  'GB:WLS': ['Cardiff', 'Swansea', 'Newport'],
  'AE:DXB': ['Dubai', 'Jumeirah', 'Deira', 'Marina'],
  'AE:AUH': ['Abu Dhabi', 'Al Ain'],
  'AE:SHJ': ['Sharjah'],
  'SA:RIY': ['Riyadh'],
  'SA:MKK': ['Jeddah', 'Mecca'],
  'SA:MED': ['Medina'],
  'SA:ESH': ['Dammam', 'Khobar', 'Dhahran'],
  'EG:C': ['Cairo', 'Nasr City', 'Maadi'],
  'EG:ALX': ['Alexandria'],
  'PK:PB': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
  'PK:SD': ['Karachi', 'Hyderabad', 'Sukkur'],
  'PK:IS': ['Islamabad'],
  'IN:MH': ['Mumbai', 'Pune', 'Nagpur'],
  'IN:DL': ['New Delhi', 'Delhi'],
  'IN:KA': ['Bangalore', 'Mysore'],
  'AU:NSW': ['Sydney', 'Newcastle', 'Wollongong'],
  'AU:VIC': ['Melbourne', 'Geelong'],
  'AU:QLD': ['Brisbane', 'Gold Coast', 'Cairns'],
  DE: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
  IT: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
  NL: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  TR: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'],
  QA: ['Doha', 'Al Wakrah', 'Al Khor'],
  KW: ['Kuwait City', 'Hawalli', 'Salmiya'],
  BH: ['Manama', 'Riffa', 'Muharraq'],
  OM: ['Muscat', 'Salalah', 'Sohar'],
  JO: ['Amman', 'Zarqa', 'Irbid'],
  LB: ['Beirut', 'Tripoli', 'Sidon'],
  MA: ['Casablanca', 'Rabat', 'Marrakesh', 'Fez'],
  NG: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano'],
  ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
  MX: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla'],
};

export function getCountries() {
  return COUNTRIES;
}

export function getStates(countryCode) {
  if (!countryCode) return [];
  return STATES[countryCode] || [];
}

export function getCities(countryCode, stateCode) {
  if (!countryCode) return [];
  if (stateCode) {
    const key = `${countryCode}:${stateCode}`;
    if (CITIES[key]) return CITIES[key];
  }
  if (CITIES[countryCode]) return CITIES[countryCode];
  const country = COUNTRIES.find((c) => c.code === countryCode);
  return country ? [country.name] : [];
}

export function getCountryName(code) {
  return COUNTRIES.find((c) => c.code === code)?.name || code;
}

export function getStateName(countryCode, stateCode) {
  return getStates(countryCode).find((s) => s.code === stateCode)?.name || stateCode;
}

export function isValidLocation(country, state, city) {
  if (!country) return false;
  const states = getStates(country);
  if (states.length > 0 && !state) return false;
  if (!city || city.trim().length < 2) return false;
  return true;
}
