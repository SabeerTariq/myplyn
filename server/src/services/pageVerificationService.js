import prisma from '../lib/prisma.js';
import { OTHERS_NICHE_SLUG } from '../data/locations.js';

export { OTHERS_NICHE_SLUG };

export async function getOthersNicheId() {
  const niche = await prisma.niche.findUnique({ where: { slug: OTHERS_NICHE_SLUG } });
  return niche?.id || null;
}

export async function normalizePageInput(body) {
  const nicheId = body.nicheId && String(body.nicheId).trim() ? body.nicheId : null;
  const customNiche = body.customNiche?.trim() || null;
  const othersId = await getOthersNicheId();

  if (othersId && nicheId === othersId) {
    if (!customNiche || customNiche.length < 2) {
      const err = new Error('Please describe your niche when selecting Others');
      err.status = 400;
      throw err;
    }
  } else if (customNiche) {
    const err = new Error('Custom niche is only allowed when Others is selected');
    err.status = 400;
    throw err;
  }

  return {
    platformId: body.platformId,
    nicheId,
    customNiche: othersId && nicheId === othersId ? customNiche : null,
    name: body.name?.trim(),
    url: body.url?.trim(),
    followers: body.followers,
    avgReach: body.avgReach ?? 0,
    engagement: body.engagement ?? null,
    country: body.country?.trim() || null,
    state: body.state?.trim() || null,
    city: body.city?.trim() || null,
  };
}

export function displayNiche(page) {
  if (!page) return '—';
  if (page.niche?.slug === OTHERS_NICHE_SLUG && page.customNiche) return page.customNiche;
  return page.niche?.name || page.customNiche || '—';
}

export function displayLocation(page) {
  if (!page) return '—';
  const parts = [page.city, page.state, page.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}
