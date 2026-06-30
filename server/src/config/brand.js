export const BRAND = {
  name: 'My Plyn',
  slug: 'myplyn',
  domain: 'myplyn.com',
  supportEmail: 'support@myplyn.com',
  noreplyEmail: 'noreply@myplyn.local',
};

export const brandEmail = (local) => `${local}@${BRAND.domain}`;
