import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taxonomyApi } from '../../services/api';
import { OTHERS_NICHE_SLUG } from '../../utils/pageForm';

export const MAX_PAGE_NICHES = 5;

export default function NicheSelect({ value, onChange, required = false }) {
  const { nicheIds = [], customNiche } = value;

  const { data: niches = [] } = useQuery({
    queryKey: ['niches'],
    queryFn: () => taxonomyApi.niches().then((r) => r.data.niches),
  });

  const othersNiche = useMemo(
    () => niches.find((n) => n.slug === OTHERS_NICHE_SLUG),
    [niches],
  );

  const selectedIds = useMemo(
    () => nicheIds.map((id) => String(id)),
    [nicheIds],
  );

  const isOtherSelected = othersNiche && selectedIds.includes(String(othersNiche.id));
  const atLimit = selectedIds.length >= MAX_PAGE_NICHES;

  const toggleNiche = (nicheId) => {
    const id = String(nicheId);
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      const nextIds = selectedIds.filter((item) => item !== id);
      onChange({
        nicheIds: nextIds,
        customNiche: othersNiche && id === String(othersNiche.id) ? '' : customNiche,
      });
      return;
    }

    if (atLimit) return;

    onChange({
      nicheIds: [...selectedIds, id],
    });
  };

  return (
    <div className="cr-form-stack">
      <div className="cr-form-field">
        <label className="label">Niches</label>
        <p className="cr-form-hint">
          Select up to {MAX_PAGE_NICHES} niches that best describe your content.
          {selectedIds.length > 0 && ` (${selectedIds.length}/${MAX_PAGE_NICHES} selected)`}
        </p>
        <div className="cr-niche-grid" role="group" aria-label="Content niches">
          {niches.map((niche) => {
            const checked = selectedIds.includes(String(niche.id));
            const disabled = !checked && atLimit;

            return (
              <label
                key={niche.id}
                className={`cr-niche-option${checked ? ' cr-niche-option--checked' : ''}${disabled ? ' cr-niche-option--disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleNiche(niche.id)}
                />
                <span>{niche.name}</span>
              </label>
            );
          })}
        </div>
        {required && selectedIds.length === 0 && (
          <p className="cr-form-hint">Select at least one niche.</p>
        )}
      </div>

      {isOtherSelected && (
        <div className="cr-form-field">
          <label className="label">Describe your niche</label>
          <input
            className="input"
            required
            placeholder="e.g. Pet care, Parenting, Automotive"
            value={customNiche}
            onChange={(e) => onChange({ customNiche: e.target.value })}
          />
          <p className="cr-form-hint">Required when &quot;Other&quot; is selected.</p>
        </div>
      )}
    </div>
  );
}

export function getNichePayload(nicheValue) {
  const nicheIds = [...new Set((nicheValue.nicheIds || []).map((id) => String(id)).filter(Boolean))];

  return {
    nicheIds,
    nicheId: nicheIds[0] || null,
    customNiche: nicheValue.customNiche?.trim() || null,
  };
}
