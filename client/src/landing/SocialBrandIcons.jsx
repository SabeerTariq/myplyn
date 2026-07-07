/* Phone list icons — white glyph on colored square */
export function InstagramIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const TIKTOK_NOTE_PATH =
  'M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.685a3.708 3.708 0 0 1-7.423 0 3.708 3.708 0 0 1 3.711-3.711c.279 0 .547.031.811.08v-2.662a6.311 6.311 0 0 0-.811-.079 6.334 6.334 0 0 0-6.342 6.342 6.334 6.334 0 0 0 10.864 4.488V9.025a8.252 8.252 0 0 0 4.773 1.526V6.79a4.823 4.823 0 0 1-1.019-.104z';

export function TikTokIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#25F4EE" d={TIKTOK_NOTE_PATH} transform="translate(0.45 0.45)" />
      <path fill="#FE2C55" d={TIKTOK_NOTE_PATH} transform="translate(0.2 0.2)" />
      <path fill="#fff" d={TIKTOK_NOTE_PATH} />
    </svg>
  );
}

export function FacebookIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.12 8.4h-1.47V6.9c0-.62.42-.76 1.02-.76h.98V3.6h-2.5c-2.22 0-2.73 1.38-2.73 2.73v1.47H8.4v2.73h1.92v8.27h3.12v-8.27h2.1l.3-2.73h-2.4z" />
    </svg>
  );
}

export function YouTubeIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.5 7.8v8.4L17.5 12 9.5 7.8z" />
    </svg>
  );
}

export function XIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function LinkedInIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* Floating hero icons — full brand logos on white circles */
export function InstagramBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="igBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="35%" stopColor="#F77737" />
          <stop offset="65%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#C13584" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igBrandGrad)" />
      <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="5" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="#fff" />
    </svg>
  );
}

export function TikTokBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#000" d={TIKTOK_NOTE_PATH} />
    </svg>
  );
}

export function FacebookBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.12 8.4h-1.47V6.9c0-.62.42-.76 1.02-.76h.98V3.6h-2.5c-2.22 0-2.73 1.38-2.73 2.73v1.47H8.4v2.73h1.92v8.27h3.12v-8.27h2.1l.3-2.73h-2.4z"
      />
    </svg>
  );
}

export function YouTubeBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#FF0000"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z"
      />
      <path fill="#fff" d="M9.75 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}
