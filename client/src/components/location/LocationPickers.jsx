import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Icon from '../Icon';
import AuthPickerModal from '../auth/AuthPickerModal';
import { taxonomyApi } from '../../services/api';
import { LOCATION_OTHER } from '../../utils/pageForm';
import '../../styles/auth.css';

function PickerTrigger({ label, value, placeholder, disabled, onClick, variant }) {
  const isAuth = variant === 'auth';

  if (isAuth) {
    return (
      <div className="auth-field">
        <label>{label}</label>
        <button
          type="button"
          className="auth-picker-trigger"
          disabled={disabled}
          onClick={onClick}
        >
          <span className={value ? 'auth-picker-trigger-value' : 'auth-picker-trigger-placeholder'}>
            {value || placeholder}
          </span>
          <Icon name="expand_more" size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="cr-form-field">
      <label className="label">{label}</label>
      <button
        type="button"
        className="cr-picker-trigger"
        disabled={disabled}
        onClick={onClick}
      >
        <span className={value ? 'cr-picker-trigger-value' : 'cr-picker-trigger-placeholder'}>
          {value || placeholder}
        </span>
        <Icon name="expand_more" size={20} />
      </button>
    </div>
  );
}

export default function LocationPickers({
  value,
  onChange,
  countryLabel = 'Country',
  cityLabel = 'City',
  variant = 'creator',
}) {
  const { country, state, city, customCity } = value;
  const [openModal, setOpenModal] = useState(null);
  const [cityMode, setCityMode] = useState(() => (
    city === LOCATION_OTHER || customCity ? 'other' : 'select'
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

  const countryOptions = useMemo(
    () => countries.map((item) => ({ value: item.code, label: item.name })),
    [countries],
  );

  const stateOptions = useMemo(
    () => states.map((item) => ({ value: item.code, label: item.name })),
    [states],
  );

  const cityOptions = useMemo(() => {
    const items = cities.map((item) => ({ value: item, label: item }));
    items.push({ value: LOCATION_OTHER, label: 'Other (type manually)' });
    return items;
  }, [cities]);

  const countryLabelText = countryOptions.find((item) => item.value === country)?.label || '';
  const stateLabelText = stateOptions.find((item) => item.value === state)?.label || '';
  const cityLabelText = cityMode === 'other'
    ? (customCity || 'Other city')
    : (cityOptions.find((item) => item.value === city)?.label || '');

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

  const wrapperClass = variant === 'auth' ? undefined : 'cr-form-grid cr-form-grid--3';

  return (
    <>
      <div className={wrapperClass}>
        <PickerTrigger
          variant={variant}
          label={countryLabel}
          value={countryLabelText}
          placeholder="Select country"
          onClick={() => setOpenModal('country')}
        />

        {states.length > 0 && (
          <PickerTrigger
            variant={variant}
            label="State / region"
            value={stateLabelText}
            placeholder="Select state or region"
            disabled={!country}
            onClick={() => setOpenModal('state')}
          />
        )}

        <PickerTrigger
          variant={variant}
          label={cityLabel}
          value={cityLabelText}
          placeholder={country ? 'Select city' : 'Select country first'}
          disabled={!country}
          onClick={() => setOpenModal('city')}
        />
      </div>

      {cityMode === 'other' && (
        variant === 'auth' ? (
          <div className="auth-field">
            <label htmlFor="location-custom-city">City name</label>
            <input
              id="location-custom-city"
              className="auth-input"
              placeholder="Type your city"
              value={customCity}
              onChange={(e) => onChange({ customCity: e.target.value, city: LOCATION_OTHER })}
            />
          </div>
        ) : (
          <div className="cr-form-field">
            <label className="label">City name</label>
            <input
              className="input"
              placeholder="Type your city"
              value={customCity}
              onChange={(e) => onChange({ customCity: e.target.value, city: LOCATION_OTHER })}
            />
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
          </div>
        )
      )}

      <AuthPickerModal
        open={openModal === 'country'}
        onClose={() => setOpenModal(null)}
        title="Select country"
        options={countryOptions}
        value={country}
        onSelect={handleCountry}
        placeholder="Search countries"
        searchable
      />

      <AuthPickerModal
        open={openModal === 'state'}
        onClose={() => setOpenModal(null)}
        title="Select state or region"
        options={stateOptions}
        value={state}
        onSelect={handleState}
        placeholder="Search states"
        searchable
      />

      <AuthPickerModal
        open={openModal === 'city'}
        onClose={() => setOpenModal(null)}
        title="Select city"
        options={cityOptions}
        value={city}
        onSelect={handleCity}
        placeholder="Search cities"
        searchable
      />
    </>
  );
}

export function getLocationCity(locationValue) {
  if (locationValue.city === LOCATION_OTHER) {
    return locationValue.customCity?.trim() || '';
  }
  return locationValue.city?.trim() || '';
}

export function getLocationPayload(locationValue) {
  return {
    country: locationValue.country,
    state: locationValue.state || null,
    city: getLocationCity(locationValue),
  };
}
