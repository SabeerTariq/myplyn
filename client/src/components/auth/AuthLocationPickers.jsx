import LocationPickers, { getLocationCity, getLocationPayload } from '../location/LocationPickers';

export default function AuthLocationPickers(props) {
  return <LocationPickers {...props} variant="auth" />;
}

export function getAuthLocationCity(locationValue) {
  return getLocationCity(locationValue);
}

export { getLocationPayload };
