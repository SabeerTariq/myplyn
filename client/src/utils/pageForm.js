export const OTHERS_NICHE_SLUG = 'others';
export const LOCATION_OTHER = '__other__';

export function displayPageNiche(page) {
  if (!page) return '—';
  if (page.niche?.slug === OTHERS_NICHE_SLUG && page.customNiche) return page.customNiche;
  return page.niche?.name || page.customNiche || '—';
}

export function displayPageLocation(page) {
  if (!page) return '—';
  const parts = [page.city, page.state, page.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}
