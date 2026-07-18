import prisma from '../lib/prisma.js';
import { OTHERS_NICHE_SLUG } from '../data/locations.js';
import { MAX_PAGE_NICHES } from '../data/niches.js';

export { OTHERS_NICHE_SLUG };

export async function getOthersNicheId() {
  const niche = await prisma.niche.findUnique({ where: { slug: OTHERS_NICHE_SLUG } });
  return niche?.id || null;
}

function collectNicheIds(body) {
  if (Array.isArray(body.nicheIds)) {
    return [...new Set(body.nicheIds.map((id) => String(id).trim()).filter(Boolean))];
  }
  if (body.nicheId && String(body.nicheId).trim()) {
    return [String(body.nicheId).trim()];
  }
  return [];
}

export async function normalizePageInput(body) {
  const nicheIds = collectNicheIds(body);
  const customNiche = body.customNiche?.trim() || null;
  const othersId = await getOthersNicheId();
  const hasOther = othersId && nicheIds.includes(othersId);

  if (nicheIds.length > MAX_PAGE_NICHES) {
    const err = new Error(`You can select up to ${MAX_PAGE_NICHES} niches`);
    err.status = 400;
    throw err;
  }

  if (hasOther) {
    if (!customNiche || customNiche.length < 2) {
      const err = new Error('Please describe your niche when selecting Other');
      err.status = 400;
      throw err;
    }
  } else if (customNiche) {
    const err = new Error('Custom niche is only allowed when Other is selected');
    err.status = 400;
    throw err;
  }

  return {
    platformId: body.platformId,
    nicheId: nicheIds[0] || null,
    nicheIds,
    customNiche: hasOther ? customNiche : null,
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

export async function syncPageNiches(pageId, nicheIds) {
  await prisma.creatorPageNiche.deleteMany({ where: { pageId } });
  if (nicheIds.length) {
    await prisma.creatorPageNiche.createMany({
      data: nicheIds.map((nicheId) => ({ pageId, nicheId })),
    });
  }
}

export function getPageNicheIds(page) {
  if (!page) return [];
  const fromJoin = page.niches?.map((entry) => entry.nicheId || entry.niche?.id).filter(Boolean) || [];
  if (fromJoin.length) return fromJoin;
  return page.nicheId ? [page.nicheId] : [];
}

export function displayNiche(page) {
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

export function displayLocation(page) {
  if (!page) return '—';
  const parts = [page.city, page.state, page.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

export const pageInclude = {
  platform: true,
  niche: true,
  niches: { include: { niche: true } },
};
