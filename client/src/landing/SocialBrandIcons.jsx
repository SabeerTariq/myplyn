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

export function GoogleBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AppleBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function LinkedInBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.12 9.5H4.74v9.02h2.38V9.5zM5.93 8.38a1.38 1.38 0 1 1 0-2.76 1.38 1.38 0 0 1 0 2.76zM19.26 18.52h-2.37v-4.39c0-1.05-.02-2.4-1.46-2.4-1.46 0-1.68 1.14-1.68 2.32v4.47H11.38V9.5h2.27v1.22h.03c.32-.6 1.1-1.23 2.26-1.23 2.42 0 2.87 1.59 2.87 3.66v5.37z"
      />
    </svg>
  );
}

export function XBrandLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#000" />
      <path
        fill="#fff"
        d="M13.2 11.2 17.9 6h-1.1l-4.1 4.5L9.5 6H6l4.9 5.7L6 18h1.1l4.3-4.7 3.5 4.7H18l-4.8-5.5z"
      />
    </svg>
  );
}
