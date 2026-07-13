import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Select from '../Select';
import { taxonomyApi } from '../../services/api';
import { LOCATION_OTHER } from '../../utils/pageForm';

export default function LocationFields({ value, onChange, required = true }) {
  const { country, state, city, customCity } = value;
  const [cityMode, setCityMode] = useState(() => (
    city && !city.includes('__') ? 'select' : (customCity ? 'other' : 'select')
  ));

  const { data: countries = [] } = useQuery({
    queryKey: ['taxonomy-countries'],
    queryFn: () => taxonomyApi.countries().then((r) => r.data.countries),
  });

  const { data: states = [] } = useQuery({
    queryKey: ['taxonomy-states', country],
    queryFn: () => taxonomyApi.states(country).then((r) => r.data.states),
    enabled: !!country,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['taxonomy-cities', country, state],
    queryFn: () => taxonomyApi.cities(country, state).then((r) => r.data.cities),
    enabled: !!country,
  });

  const cityOptions = useMemo(() => cities, [cities]);

  const handleCountry = (nextCountry) => {
    onChange({ country: nextCountry, state: '', city: '', customCity: '' });
    setCityMode('select');
  };

  const handleState = (nextState) => {
    onChange({ state: nextState, city: '', customCity: '' });
    setCityMode('select');
  };

  const handleCity = (nextCity) => {
    if (nextCity === LOCATION_OTHER) {
      setCityMode('other');
      onChange({ city: LOCATION_OTHER, customCity: customCity || '' });
      return;
    }
    setCityMode('select');
    onChange({ city: nextCity, customCity: '' });
  };

  return (
    <div className="cr-form-grid cr-form-grid--3">
      <div className="cr-form-field">
        <label className="label">Country</label>
        <Select
          required={required}
          value={country}
          onChange={(e) => handleCountry(e.target.value)}
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div className="cr-form-field">
        <label className="label">State / Region</label>
        <Select
          required={required && states.length > 0}
          value={state}
          disabled={!country || states.length === 0}
          onChange={(e) => handleState(e.target.value)}
        >
          <option value="">{states.length ? 'Select state' : 'Not required'}</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </Select>
      </div>

      <div className="cr-form-field">
        <label className="label">City</label>
        {cityMode === 'other' ? (
          <input
            className="input"
            required={required}
            placeholder="Type your city"
            value={customCity}
            onChange={(e) => onChange({ customCity: e.target.value, city: LOCATION_OTHER })}
          />
        ) : (
          <Select
            required={required}
            value={city || ''}
            disabled={!country}
            onChange={(e) => handleCity(e.target.value)}
          >
            <option value="">Select city</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value={LOCATION_OTHER}>Other (type manually)</option>
          </Select>
        )}
        {cityMode === 'other' && (
          <button
            type="button"
            className="cr-form-link-btn"
            onClick={() => {
              setCityMode('select');
              onChange({ city: '', customCity: '' });
            }}
          >
            Back to city list
          </button>
        )}
      </div>
    </div>
  );
}

export function getLocationPayload(locationValue) {
  const city = locationValue.city === LOCATION_OTHER
    ? locationValue.customCity?.trim()
    : locationValue.city?.trim();
  return {
    country: locationValue.country,
    state: locationValue.state || null,
    city,
  };
}
