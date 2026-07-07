export const BRAND = {
  name: 'MYPLYN',
  slug: 'myplyn',
  domain: 'myplyn.com',
  supportEmail: 'support@myplyn.com',
  noreplyEmail: 'noreply@myplyn.local',
};

export const brandEmail = (local) => `${local}@${BRAND.domain}`;
