import { getPageNicheIds } from './pageVerificationService.js';

function parseJsonList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split(',').map((s) => s.trim()).filter(Boolean);
  }
}

function daysAgo(date) {
  if (!date) return 999;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function timeAgo(date) {
  const days = daysAgo(date);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function scoreCampaignMatch(campaign, creatorPages = [], appliedCampaignIds = new Set()) {
  const reasons = [];
  let score = 0;

  const campaignPlatformIds = campaign.platforms?.map((p) => p.platformId || p.platform?.id).filter(Boolean) || [];
  const campaignNicheIds = campaign.niches?.map((n) => n.nicheId || n.niche?.id).filter(Boolean) || [];
  const targetCountries = parseJsonList(campaign.targeting?.countries).map((c) => c.toLowerCase());
  const targetCities = parseJsonList(campaign.targeting?.cities).map((c) => c.toLowerCase());

  const verifiedPages = creatorPages.filter((p) => p.verificationStatus === 'VERIFIED');
  const matchingPages = [];

  for (const page of verifiedPages) {
    let pageScore = 0;
    const pageReasons = [];

    if (campaignPlatformIds.length === 0 || campaignPlatformIds.includes(page.platformId)) {
      pageScore += 30;
      pageReasons.push('Platform match');
    }
    const pageNicheIds = getPageNicheIds(page);
    if (campaignNicheIds.length === 0 || pageNicheIds.some((id) => campaignNicheIds.includes(id))) {
      pageScore += 25;
      pageReasons.push('Niche match');
    }
    if (targetCountries.length === 0 || (page.country && targetCountries.includes(page.country.toLowerCase()))) {
      pageScore += 15;
      pageReasons.push('Location match');
    } else if (page.country) {
      pageScore += 5;
    }
    if (targetCities.length > 0 && page.city && targetCities.includes(page.city.toLowerCase())) {
      pageScore += 10;
      pageReasons.push('City match');
    }

    const perPlacement = Number(campaign.perPlacement || campaign.budgetTotal || 0);
    const followers = Number(page.followers || 0);
    if (perPlacement > 0 && followers > 0) {
      const rate = perPlacement / followers;
      if (rate >= 0.001 && rate <= 0.05) {
        pageScore += 12;
        pageReasons.push('Budget fits your audience');
      } else if (rate <= 0.1) {
        pageScore += 6;
      }
    }

    if (pageScore > 0) {
      matchingPages.push({ page, pageScore, pageReasons });
    }
  }

  if (matchingPages.length > 0) {
    matchingPages.sort((a, b) => b.pageScore - a.pageScore);
    const best = matchingPages[0];
    score += best.pageScore;
    reasons.push(...best.pageReasons);
  } else if (verifiedPages.length === 0) {
    score += 8;
    reasons.push('List a verified page to improve matches');
  }

  const recencyDays = daysAgo(campaign.createdAt);
  if (recencyDays <= 3) {
    score += 10;
    reasons.push('Recently posted');
  } else if (recencyDays <= 14) {
    score += 5;
  }

  const budget = Number(campaign.budgetTotal || 0);
  if (budget >= 500) {
    score += 8;
    reasons.push('Well-funded campaign');
  } else if (budget >= 100) {
    score += 4;
  }

  if (appliedCampaignIds.has(campaign.id)) {
    score = Math.max(score - 40, 0);
    reasons.push('Already applied');
  }

  const uniqueReasons = [...new Set(reasons)];
  const matchLevel = score >= 70 ? 'high' : score >= 45 ? 'medium' : score >= 25 ? 'low' : 'none';

  return {
    matchScore: Math.min(score, 100),
    matchLevel,
    matchReasons: uniqueReasons.slice(0, 4),
    bestMatchingPage: matchingPages[0]?.page || null,
    postedAgo: timeAgo(campaign.createdAt),
  };
}

export function buildCampaignWhere(query) {
  const {
    q,
    platformId,
    nicheId,
    country,
    minBudget,
    maxPrice,
    minPerPlacement,
  } = query;

  const where = { status: 'LIVE' };

  if (maxPrice) where.budgetTotal = { lte: parseFloat(maxPrice) };
  if (minBudget) {
    where.budgetTotal = { ...(where.budgetTotal || {}), gte: parseFloat(minBudget) };
  }
  if (minPerPlacement) {
    where.perPlacement = { gte: parseFloat(minPerPlacement) };
  }
  if (platformId) {
    where.platforms = { some: { platformId: String(platformId) } };
  }
  if (nicheId) {
    where.niches = { some: { nicheId: String(nicheId) } };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { requirements: { contains: q } },
      { advertiser: { companyName: { contains: q } } },
    ];
  }

  return where;
}

export function filterCampaignsByCountry(campaigns, country) {
  if (!country) return campaigns;
  const needle = country.toLowerCase();
  return campaigns.filter((c) => {
    const countries = parseJsonList(c.targeting?.countries).map((x) => x.toLowerCase());
    return countries.length === 0 || countries.includes(needle);
  });
}

export function sortCampaigns(campaigns, sort) {
  const list = [...campaigns];
  switch (sort) {
    case 'budget_high':
      return list.sort((a, b) => Number(b.budgetTotal) - Number(a.budgetTotal));
    case 'budget_low':
      return list.sort((a, b) => Number(a.budgetTotal) - Number(b.budgetTotal));
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'best_match':
    default:
      return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}

export function scoreCreatorMatch(page, advertiserCampaigns = []) {
  const reasons = [];
  let score = 0;

  if (!page || page.verificationStatus !== 'VERIFIED') {
    return { matchScore: 0, matchLevel: 'none', matchReasons: [] };
  }

  const liveCampaigns = advertiserCampaigns.filter((c) => c.status === 'LIVE');
  if (liveCampaigns.length === 0) {
    score += 20;
    reasons.push('Verified creator');
    if (Number(page.followers) >= 10000) {
      score += 15;
      reasons.push('Strong audience');
    }
    const matchLevel = score >= 45 ? 'medium' : 'low';
    return { matchScore: Math.min(score, 100), matchLevel, matchReasons: reasons.slice(0, 4) };
  }

  let bestCampaignScore = 0;
  const uniqueReasons = new Set();

  for (const campaign of liveCampaigns) {
    let campaignScore = 0;
    const campaignPlatformIds = campaign.platforms?.map((p) => p.platformId || p.platform?.id).filter(Boolean) || [];
    const campaignNicheIds = campaign.niches?.map((n) => n.nicheId || n.niche?.id).filter(Boolean) || [];
    const targetCountries = parseJsonList(campaign.targeting?.countries).map((c) => c.toLowerCase());

    if (campaignPlatformIds.length === 0 || campaignPlatformIds.includes(page.platformId)) {
      campaignScore += 30;
      uniqueReasons.add('Platform match');
    }
    const pageNicheIds = getPageNicheIds(page);
    if (campaignNicheIds.length === 0 || pageNicheIds.some((id) => campaignNicheIds.includes(id))) {
      campaignScore += 25;
      uniqueReasons.add('Niche match');
    }
    if (targetCountries.length === 0 || (page.country && targetCountries.includes(page.country.toLowerCase()))) {
      campaignScore += 15;
      uniqueReasons.add('Location match');
    }

    const perPlacement = Number(campaign.perPlacement || campaign.budgetTotal || 0);
    const followers = Number(page.followers || 0);
    if (perPlacement > 0 && followers > 0) {
      const rate = perPlacement / followers;
      if (rate >= 0.001 && rate <= 0.05) {
        campaignScore += 12;
        uniqueReasons.add('Rate fits campaign budget');
      }
    }

    bestCampaignScore = Math.max(bestCampaignScore, campaignScore);
  }

  score += bestCampaignScore;

  const engagement = Number(page.engagement || 0);
  if (engagement >= 3) {
    score += 10;
    uniqueReasons.add('High engagement');
  } else if (engagement >= 1.5) {
    score += 5;
  }

  const followers = Number(page.followers || 0);
  if (followers >= 50000) {
    score += 8;
    uniqueReasons.add('Large audience');
  } else if (followers >= 10000) {
    score += 4;
  }

  const matchLevel = score >= 70 ? 'high' : score >= 45 ? 'medium' : score >= 25 ? 'low' : 'none';
  return {
    matchScore: Math.min(score, 100),
    matchLevel,
    matchReasons: [...uniqueReasons].slice(0, 4),
  };
}

export function sortCreators(creators, sort) {
  const list = [...creators];
  switch (sort) {
    case 'followers_low':
      return list.sort((a, b) => Number(a.followers) - Number(b.followers));
    case 'engagement_high':
      return list.sort((a, b) => Number(b.engagement) - Number(a.engagement));
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'followers_high':
      return list.sort((a, b) => Number(b.followers) - Number(a.followers));
    case 'best_match':
    default:
      return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}

export function buildCreatorWhere(query) {
  const { country, city, platformId, nicheId, minFollowers, q } = query;
  const where = { verificationStatus: 'VERIFIED' };

  if (country) where.country = country;
  if (city) where.city = city;
  if (platformId) where.platformId = String(platformId);
  if (nicheId) {
    const nicheFilter = String(nicheId);
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { nicheId: nicheFilter },
          { niches: { some: { nicheId: nicheFilter } } },
        ],
      },
    ];
  }
  if (minFollowers) where.followers = { gte: parseInt(minFollowers, 10) };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { url: { contains: q } },
      { country: { contains: q } },
      { city: { contains: q } },
      { creator: { user: { name: { contains: q } } } },
    ];
  }

  return where;
}
