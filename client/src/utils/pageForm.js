export const OTHERS_NICHE_SLUG = 'others';
export const LOCATION_OTHER = '__other__';

export function displayPageNiche(page) {
  if (!page) return '—';

  const labels = (page.niches || [])
    .map((entry) => entry.niche)
    .filter(Boolean)
    .map((niche) => {
      if (niche.slug === OTHERS_NICHE_SLUG && page.customNiche) return page.customNiche;
      return niche.name;
    });

  if (labels.length) return labels.join(', ');

  if (page.niche?.slug === OTHERS_NICHE_SLUG && page.customNiche) return page.customNiche;
  return page.niche?.name || page.customNiche || '—';
}

export function displayPageLocation(page) {
  if (!page) return '—';
  const parts = [page.city, page.state, page.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}
