import { useQuery } from '@tanstack/react-query';
import Select from '../Select';
import LocationFields, { getLocationPayload } from './LocationFields';
import NicheSelect, { getNichePayload } from './NicheSelect';
import { taxonomyApi } from '../../services/api';

const EMPTY_LOCATION = { country: '', state: '', city: '', customCity: '' };
const EMPTY_NICHE = { nicheId: '', customNiche: '' };

export function buildPageFormState(page) {
  if (!page) {
    return {
      platformId: '',
      niche: { ...EMPTY_NICHE },
      location: { ...EMPTY_LOCATION },
      name: '',
      url: '',
      followers: '',
      avgReach: '',
      engagement: '',
    };
  }

  return {
    platformId: page.platformId || '',
    niche: { nicheId: page.nicheId || '', customNiche: page.customNiche || '' },
    location: {
      country: page.country || '',
      state: page.state || '',
      city: page.city || '',
      customCity: '',
    },
    name: page.name || '',
    url: page.url || '',
    followers: page.followers != null ? String(page.followers) : '',
    avgReach: page.avgReach != null ? String(page.avgReach) : '',
    engagement: page.engagement != null ? String(page.engagement) : '',
  };
}

export function buildPagePayload(form) {
  const location = getLocationPayload(form.location);
  const niche = getNichePayload(form.niche);

  return {
    platformId: form.platformId,
    ...niche,
    name: form.name.trim(),
    url: form.url.trim(),
    followers: parseInt(form.followers, 10),
    avgReach: parseInt(form.avgReach, 10) || 0,
    engagement: form.engagement !== '' ? parseFloat(form.engagement) : null,
    ...location,
  };
}

export default function CreatorPageFormFields({ form, setForm, error }) {
  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms),
  });

  return (
    <div className="cr-page-form">
      {error && <p className="cr-form-error">{error}</p>}

      <div className="cr-form-section">
        <h3>Page details</h3>
        <div className="cr-form-stack">
          <div className="cr-form-field">
            <label className="label">Platform</label>
            <Select
              required
              value={form.platformId}
              onChange={(e) => setForm({ ...form, platformId: e.target.value })}
            >
              <option value="">Select platform</option>
              {platforms?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>

          <div>
            <label className="label">Page name</label>
            <input
              className="input"
              required
              placeholder="Your page or channel name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Profile URL</label>
            <input
              className="input"
              type="url"
              required
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          <NicheSelect
            value={form.niche}
            onChange={(patch) => setForm({ ...form, niche: { ...form.niche, ...patch } })}
          />
        </div>
      </div>

      <div className="cr-form-section">
        <h3>Audience location</h3>
        <p className="cr-form-hint">Select where most of your audience is based. This helps match you with relevant campaigns.</p>
        <LocationFields
          value={form.location}
          onChange={(patch) => setForm({ ...form, location: { ...form.location, ...patch } })}
        />
      </div>

      <div className="cr-form-section">
        <h3>Audience stats</h3>
        <div className="cr-form-grid cr-form-grid--3">
          <div>
            <label className="label">Followers</label>
            <input
              type="number"
              className="input"
              required
              min="0"
              value={form.followers}
              onChange={(e) => setForm({ ...form, followers: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Avg reach</label>
            <input
              type="number"
              className="input"
              min="0"
              value={form.avgReach}
              onChange={(e) => setForm({ ...form, avgReach: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Engagement %</label>
            <input
              type="number"
              className="input"
              min="0"
              max="100"
              step="0.1"
              value={form.engagement}
              onChange={(e) => setForm({ ...form, engagement: e.target.value })}
            />
          </div>
        </div>
      </div>

      <p className="cr-form-hint">
        After submission, your page goes to admin review. Verified pages can apply to marketplace campaigns.
      </p>
    </div>
  );
}
