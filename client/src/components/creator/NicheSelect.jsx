import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Select from '../Select';
import { taxonomyApi } from '../../services/api';
import { OTHERS_NICHE_SLUG } from '../../utils/pageForm';

export default function NicheSelect({ value, onChange, required = false }) {
  const { nicheId, customNiche } = value;

  const { data: niches = [] } = useQuery({
    queryKey: ['niches'],
    queryFn: () => taxonomyApi.niches().then((r) => r.data.niches),
  });

  const othersNiche = useMemo(
    () => niches.find((n) => n.slug === OTHERS_NICHE_SLUG),
    [niches],
  );

  const isOthers = othersNiche && nicheId === othersNiche.id;

  return (
    <div className="cr-form-stack">
      <div className="cr-form-field">
        <label className="label">Niche</label>
        <Select
          required={required}
          value={nicheId || ''}
          onChange={(e) => {
            const next = e.target.value || '';
            onChange({
              nicheId: next,
              customNiche: othersNiche && next === othersNiche.id ? customNiche : '',
            });
          }}
        >
          <option value="">Select niche</option>
          {niches.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </Select>
      </div>

      {isOthers && (
        <div className="cr-form-field">
          <label className="label">Describe your niche</label>
          <input
            className="input"
            required
            placeholder="e.g. Pet care, Parenting, Automotive"
            value={customNiche}
            onChange={(e) => onChange({ customNiche: e.target.value })}
          />
          <p className="cr-form-hint">Required when &quot;Others&quot; is selected.</p>
        </div>
      )}
    </div>
  );
}

export function getNichePayload(nicheValue) {
  return {
    nicheId: nicheValue.nicheId || null,
    customNiche: nicheValue.customNiche?.trim() || null,
  };
}
