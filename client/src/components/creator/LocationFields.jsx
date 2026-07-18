import LocationPickers, { getLocationPayload } from '../location/LocationPickers';

export default function LocationFields({ value, onChange }) {
  return (
    <LocationPickers
      value={value}
      onChange={onChange}
      variant="creator"
      countryLabel="Country"
      cityLabel="City"
    />
  );
}

export { getLocationPayload };
