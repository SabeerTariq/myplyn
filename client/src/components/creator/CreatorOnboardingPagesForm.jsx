import NicheSelect, { getNichePayload } from './NicheSelect';
import LocationFields, { getLocationPayload } from './LocationFields';
import CreatorPagesListEditor, { createPageEntry, validatePagesList } from './CreatorPagesListEditor';
import { getLocationCity } from '../location/LocationPickers';

const EMPTY_LOCATION = { country: '', state: '', city: '', customCity: '' };
const EMPTY_NICHE = { nicheIds: [], customNiche: '' };

export { createPageEntry };

export function buildOnboardingPagesFormState() {
  return {
    niche: { ...EMPTY_NICHE },
    location: { ...EMPTY_LOCATION },
    pages: [],
  };
}

export function buildPagePayloadFromOnboarding(form, pageEntry) {
  const location = getLocationPayload(form.location);
  const niche = getNichePayload(form.niche);

  return {
    platformId: pageEntry.platformId,
    ...niche,
    name: pageEntry.name.trim(),
    url: pageEntry.url.trim(),
    followers: parseInt(pageEntry.followers, 10) || 0,
    avgReach: 0,
    engagement: null,
    ...location,
  };
}

export function validateOnboardingPagesForm(form) {
  if (!form.niche.nicheIds?.length) {
    return 'Select at least one niche.';
  }

  if (!form.location.country) {
    return 'Select your audience country.';
  }

  if (!getLocationCity(form.location)) {
    return 'Select or enter your audience city.';
  }

  return validatePagesList(form.pages);
}

export default function CreatorOnboardingPagesForm({ form, setForm, error }) {
  return (
    <div className="cr-page-form cr-onboarding-pages-form">
      {error && <p className="cr-form-error">{error}</p>}

      <div className="cr-form-section">
        <h3>Your niches</h3>
        <NicheSelect
          value={form.niche}
          onChange={(patch) => setForm({ ...form, niche: { ...form.niche, ...patch } })}
          required
        />
      </div>

      <div className="cr-form-section">
        <h3>Audience location</h3>
        <p className="cr-form-hint">Where most of your audience is based. Search countries, regions, and cities worldwide.</p>
        <LocationFields
          value={form.location}
          onChange={(patch) => setForm({ ...form, location: { ...form.location, ...patch } })}
        />
      </div>

      <CreatorPagesListEditor
        pages={form.pages}
        onChange={(pages) => setForm({ ...form, pages })}
      />

      <p className="cr-form-hint">
        After submission, your pages go to admin review. Verified pages can apply to marketplace campaigns.
      </p>
    </div>
  );
}
