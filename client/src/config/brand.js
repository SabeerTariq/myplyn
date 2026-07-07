export const BRAND = {
  name: 'MYPLYN',
  slug: 'myplyn',
  domain: 'myplyn.com',
  supportEmail: 'support@myplyn.com',
  noreplyEmail: 'noreply@myplyn.local',
  logoSrc: '/brand-logo.png',
  logoAlt: 'MYPLYN',
  logoLetter: 'M',
};

export const brandEmail = (local) => `${local}@${BRAND.domain}`;
