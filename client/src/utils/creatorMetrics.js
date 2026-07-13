const PLATFORM_ICONS = {
  instagram: '/landing/social/instagram.png',
  tiktok: '/landing/social/tiktok.png',
  youtube: '/landing/social/youtube.png',
  facebook: '/landing/social/communication.png',
};

export function getPlatformIcon(slug) {
  return PLATFORM_ICONS[slug] || null;
}

export function formatCount(value = 0) {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString();
}

export function formatMoney(value = 0) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export function computeScore(page) {
  const followers = Number(page.followers) || 0;
  const engagement = Number(page.engagement) || 0;
  const reach = Number(page.avgReach) || 0;
  const followerScore = Math.min(40, Math.log10(Math.max(followers, 10)) * 12);
  const engagementScore = Math.min(35, engagement * 6);
  const reachScore = Math.min(15, Math.log10(Math.max(reach, 10)) * 5);
  const verifiedBonus = page.verificationStatus === 'VERIFIED' ? 10 : page.verificationStatus === 'PENDING' ? 4 : 0;
  return Math.round(Math.min(99, Math.max(35, followerScore + engagementScore + reachScore + verifiedBonus)));
}

export function buildPageRows(pages = [], collabs = [], openCampaignCount = 0, invitations = []) {
  return pages.map((page) => {
    const pageCollabs = collabs.filter((c) => c.pageId === page.id);
    const activeCampaigns = pageCollabs.filter((c) => !['PAID_OUT', 'CANCELLED'].includes(c.status)).length;
    const earnings = pageCollabs
      .filter((c) => ['PAID_OUT', 'RELEASED', 'VERIFIED'].includes(c.status))
      .reduce((sum, c) => sum + Number(c.agreedAmount || 0), 0);
    const pendingInvites = invitations.filter((i) => i.pageId === page.id && i.status === 'PENDING').length;
    const availableCampaigns = pendingInvites + Math.max(0, Math.round(openCampaignCount * 0.25) + (page.followers > 100000 ? 4 : 2));

    return {
      ...page,
      score: computeScore(page),
      activeCampaigns,
      earnings,
      availableCampaigns,
      pendingInvites,
    };
  });
}

export function profileStrength(pages = [], connectStatus) {
  let score = 20;
  if (pages.length > 0) score += 25;
  if (pages.some((p) => p.verificationStatus === 'VERIFIED')) score += 30;
  if (pages.length >= 2) score += 10;
  if (connectStatus === 'CONNECTED') score += 15;
  return Math.min(100, score);
}
