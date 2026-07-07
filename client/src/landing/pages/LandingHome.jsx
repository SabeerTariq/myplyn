import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BRAND } from '../../config/brand';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '../SocialBrandIcons';

const HERO_SOCIAL_ICONS = {
  ig: '/landing/social/instagram.png',
  tt: '/landing/social/tiktok.png',
  fb: '/landing/social/communication.png',
  yt: '/landing/social/youtube.png',
};

const PLATFORM_PILLS = [
  { name: 'Instagram', icon: HERO_SOCIAL_ICONS.ig, type: 'img' },
  { name: 'TikTok', icon: HERO_SOCIAL_ICONS.tt, type: 'img' },
  { name: 'Facebook', icon: HERO_SOCIAL_ICONS.fb, type: 'img' },
  { name: 'YouTube', icon: HERO_SOCIAL_ICONS.yt, type: 'img' },
  { name: 'X', Icon: XIcon, type: 'svg' },
  { name: 'LinkedIn', Icon: LinkedInIcon, type: 'svg' },
];

const PLATFORM_ICONS = {
  Instagram: HERO_SOCIAL_ICONS.ig,
  TikTok: HERO_SOCIAL_ICONS.tt,
  Facebook: HERO_SOCIAL_ICONS.fb,
  YouTube: HERO_SOCIAL_ICONS.yt,
};

const DISCOVER_CREATORS = [
  { name: 'Ava Rose', img: 'https://i.pravatar.cc/120?img=47', platform: 'Instagram', niche: 'Fashion', followers: '128K', engagement: '6.4%', price: 450 },
  { name: 'Liam Carter', img: 'https://i.pravatar.cc/120?img=32', platform: 'TikTok', niche: 'Fitness', followers: '512K', engagement: '9.1%', price: 680 },
  { name: 'Maya Chen', img: 'https://i.pravatar.cc/120?img=45', platform: 'YouTube', niche: 'Tech', followers: '340K', engagement: '7.8%', price: 1200 },
  { name: 'Noah Johnson', img: 'https://i.pravatar.cc/120?img=15', platform: 'Facebook', niche: 'Lifestyle', followers: '210K', engagement: '5.6%', price: 400 },
  { name: 'Sophie Lee', img: 'https://i.pravatar.cc/120?img=24', platform: 'Instagram', niche: 'Beauty', followers: '275K', engagement: '8.3%', price: 550 },
];

function VerifiedMark() {
  return (
    <svg className="dc-verified" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z" />
    </svg>
  );
}

function CreatorCard({ creator }) {
  return (
    <article className="dc-card">
      <div className="dc-card-top">
        <img className="dc-avatar" src={creator.img} alt="" />
        <div className="dc-platform">
          <img src={PLATFORM_ICONS[creator.platform]} alt="" />
          <span>{creator.platform}</span>
        </div>
      </div>
      <div className="dc-name">
        {creator.name}
        <VerifiedMark />
      </div>
      <span className="dc-niche">{creator.niche}</span>
      <div className="dc-stats">
        <div>
          <strong>{creator.followers}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{creator.engagement}</strong>
          <span>Engagement</span>
        </div>
      </div>
      <div className="dc-price">
        From <strong>${creator.price.toLocaleString()}</strong>
      </div>
    </article>
  );
}

const TESTIMONIALS = [
  {
    quote: 'Myplyn made it easy to find the right creators and see real results.',
    name: 'Jessica Martin',
    role: 'Brand',
    img: 'https://i.pravatar.cc/80?img=47',
  },
  {
    quote: 'Fair payouts, clear terms, and zero hassle.',
    name: 'Ethan Brooks',
    role: 'Creator',
    img: 'https://i.pravatar.cc/80?img=12',
  },
  {
    quote: 'Great brands, smooth communication, and on-time payments.',
    name: 'Olivia Bennett',
    role: 'Creator',
    img: 'https://i.pravatar.cc/80?img=24',
  },
];

function TestimonialStars() {
  return (
    <div className="tr-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z" />
        </svg>
      ))}
    </div>
  );
}

const DISCOVER_CREATORS_GAP = 16;

function DiscoverCreatorsCarousel() {
  const carouselRef = useRef(null);
  const setWidthRef = useRef(0);

  const items = useMemo(
    () => [...DISCOVER_CREATORS, ...DISCOVER_CREATORS, ...DISCOVER_CREATORS],
    [],
  );

  const getStep = useCallback(() => {
    const card = carouselRef.current?.querySelector('.dc-card');
    return (card?.offsetWidth ?? 220) + DISCOVER_CREATORS_GAP;
  }, []);

  const updateSetWidth = useCallback(() => {
    setWidthRef.current = getStep() * DISCOVER_CREATORS.length;
  }, [getStep]);

  const normalizeScroll = useCallback(() => {
    const el = carouselRef.current;
    const setWidth = setWidthRef.current;
    if (!el || !setWidth) return;

    if (el.scrollLeft < setWidth * 0.5) {
      const behavior = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft += setWidth;
      el.style.scrollBehavior = behavior;
    } else if (el.scrollLeft > setWidth * 1.5) {
      const behavior = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft -= setWidth;
      el.style.scrollBehavior = behavior;
    }
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return undefined;

    updateSetWidth();
    el.scrollLeft = setWidthRef.current;

    const onResize = () => {
      updateSetWidth();
      el.scrollLeft = setWidthRef.current;
    };

    const onScrollEnd = () => normalizeScroll();

    window.addEventListener('resize', onResize);
    el.addEventListener('scrollend', onScrollEnd);

    return () => {
      window.removeEventListener('resize', onResize);
      el.removeEventListener('scrollend', onScrollEnd);
    };
  }, [normalizeScroll, updateSetWidth]);

  const scrollCreators = (direction) => {
    const el = carouselRef.current;
    if (!el) return;

    el.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
    window.setTimeout(normalizeScroll, 450);
  };

  return (
    <div className="dc-carousel-wrap">
      <button type="button" className="dc-nav dc-nav--prev" onClick={() => scrollCreators(-1)} aria-label="Previous creators">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      <div className="dc-carousel" ref={carouselRef}>
        <div className="dc-carousel-track">
          {items.map((creator, index) => (
            <CreatorCard key={`${creator.name}-${index}`} creator={creator} />
          ))}
        </div>
      </div>

      <button type="button" className="dc-nav dc-nav--next" onClick={() => scrollCreators(1)} aria-label="Next creators">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

export default function LandingHome() {
  return (
    <>





      <section className="hero hero-ref">
        <div className="hero-bg">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>
        <div className="container">
          <div className="hero-copy">
            <span className="hero-badge" data-hero>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              For Page Owners &amp; Creators
            </span>
            <h1 data-hero>
              Your page can<br />
              <span className="hl">make money.</span>
            </h1>
            <p className="lead" data-hero>
              List your social media pages, get campaign offers, and start earning from your audience.
            </p>
            <div className="hero-cta" data-hero>
              <Link to="/auth/signup/creator" className="btn btn-green btn-lg">
                Join as a Creator
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link to="/how-it-works" className="btn btn-outline btn-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                See how it works
              </Link>
            </div>
            <ul className="hero-perks" data-hero>
              <li>
                <span className="perk-ico ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                Free to join
              </li>
              <li>
                <span className="perk-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></span>
                Secure connection
              </li>
              <li>
                <span className="perk-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17l.9-5.4L4.2 7.7l5.4-.8z" /></svg></span>
                You choose the offers
              </li>
            </ul>
          </div>

          <div className="hero-visual" data-hero>
            <svg className="hero-connectors" viewBox="0 0 520 520" fill="none" aria-hidden="true">
              <path d="M120 90 Q 200 40 260 120" stroke="rgba(0,184,107,.35)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              <path d="M80 280 Q 40 360 120 400" stroke="rgba(13,43,78,.25)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              <path d="M400 100 Q 460 180 380 240" stroke="rgba(0,184,107,.3)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              <path d="M420 360 Q 360 440 280 400" stroke="rgba(13,43,78,.22)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
            </svg>

            <div className="hero-social hero-social--ig">
              <img src={HERO_SOCIAL_ICONS.ig} alt="" width={48} height={48} />
            </div>
            <div className="hero-social hero-social--tt">
              <img src={HERO_SOCIAL_ICONS.tt} alt="" width={48} height={48} />
            </div>
            <div className="hero-social hero-social--fb">
              <img src={HERO_SOCIAL_ICONS.fb} alt="" width={48} height={48} />
            </div>
            <div className="hero-social hero-social--yt">
              <img src={HERO_SOCIAL_ICONS.yt} alt="" width={48} height={48} />
            </div>

            <div className="hero-float hero-float--offer">
              <div className="hf-offer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17l.9-5.4L4.2 7.7l5.4-.8z" /></svg>
              </div>
              <div className="hf-label">New Offer</div>
              <div className="hf-amt hf-amt--green">$350</div>
              <div className="hf-brand">Fashion Brand</div>
              <button type="button" className="hf-btn">View Offer</button>
            </div>

            <div className="hero-float hero-float--payout">
              <div className="hf-icon-wrap hf-icon-wrap--wallet" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                  <path d="M16 14h.01" />
                </svg>
              </div>
              <div className="hf-sub">Payout sent</div>
              <div className="hf-amt hf-amt--green">$1,250</div>
              <div className="hf-date">May 24, 2024</div>
              <div className="hf-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
                </div>

            <div className="hero-float hero-float--earn">
              <div className="hf-icon-wrap hf-icon-wrap--chart" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16V9" />
                  <path d="M12 16V5" />
                  <path d="M17 16v-6" />
                  </svg>
                </div>
              <div className="hf-earn-wrap">
              <div className="hf-sub">Earnings</div>
              <div className="hf-amt">$4,250</div>
              <div className="hf-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
                32% this month
                </div>
              </div>
            </div>
            
            <div className="hero-pedestal" aria-hidden="true" />
            <div className="hero-phone">
              <div className="hp-notch" aria-hidden="true" />
              <div className="hp-screen">
                <div className="hp-status">
                  <span className="hp-time">9:41</span>
                  <div className="hp-status-icons">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h2V10H2v10zm6 0h2V6H8v14zm6 0h2V2h-2v18zm6 0h2v-8h-2v8z" /></svg>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 11.14 8.87 11.14 5 13z" /></svg>
                    <div className="hp-battery"><span /></div>
                  </div>
                </div>

                <div className="hp-header">
                  <div>
                    <div className="hp-welcome">Welcome back,</div>
                    <div className="hp-name">Maya <span aria-hidden="true">👋</span></div>
                  </div>
                  <img className="hp-avatar" src="https://i.pravatar.cc/80?img=45" alt="" />
                </div>

                <div className="hp-earn-card">
                  <div className="hp-earn-copy">
                    <div className="hp-earn-label">Total Earnings</div>
                    <div className="hp-earn-row">
                      <div className="hp-earn-amt">$4,250</div>
                      <span className="hp-pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                        32%
                      </span>
                    </div>
                    <div className="hp-earn-vs">vs last 30 days</div>
                  </div>
                  <svg className="hp-chart" viewBox="0 0 120 56" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="hpChartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0,184,107,.4)" />
                        <stop offset="100%" stopColor="rgba(0,184,107,0)" />
                      </linearGradient>
                    </defs>
                    <path d="M0 44 Q20 38 35 36 T70 24 T105 10 L120 8 L120 56 L0 56 Z" fill="url(#hpChartFill)" />
                    <path d="M0 44 Q20 38 35 36 T70 24 T105 10 L120 8" fill="none" stroke="#00B86B" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="hp-section-title">Connected Pages</div>
                <div className="hp-pages">
                  <div className="hp-page">
                    <div className="hp-page-icon hp-page-icon--ig">
                      <InstagramIcon />
                    </div>
                    <div className="hp-page-info">
                      <div className="hp-page-title">Instagram Page</div>
                      <div className="hp-page-sub">18K followers</div>
                    </div>
                    <span className="hp-badge">Connected</span>
                    <svg className="hp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                  <div className="hp-page">
                    <div className="hp-page-icon hp-page-icon--tt">
                      <TikTokIcon />
                    </div>
                    <div className="hp-page-info">
                      <div className="hp-page-title">TikTok Page</div>
                      <div className="hp-page-sub">42K followers</div>
                    </div>
                    <span className="hp-badge">Connected</span>
                    <svg className="hp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                  <div className="hp-page">
                    <div className="hp-page-icon hp-page-icon--fb">
                      <FacebookIcon />
                    </div>
                    <div className="hp-page-info">
                      <div className="hp-page-title">Facebook Page</div>
                      <div className="hp-page-sub">12K followers</div>
                    </div>
                    <span className="hp-badge">Connected</span>
                    <svg className="hp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                  <div className="hp-page">
                    <div className="hp-page-icon hp-page-icon--yt">
                      <YouTubeIcon />
                    </div>
                    <div className="hp-page-info">
                      <div className="hp-page-title">YouTube Channel</div>
                      <div className="hp-page-sub">8.7K subscribers</div>
                    </div>
                    <span className="hp-badge">Connected</span>
                    <svg className="hp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
            </div>
            
                <div className="hp-nav">
                  <div className="hp-nav-item on">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    <span>Dashboard</span>
                  </div>
                  <div className="hp-nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                    <span>Offers</span>
                  </div>
                  <div className="hp-nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    <span>Earnings</span>
                  </div>
                  <div className="hp-nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                    <span>Payouts</span>
                  </div>
                  <div className="hp-nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span>Profile</span>
                  </div>
                </div>
                <div className="hp-home-bar" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="trust-band">
        <div className="container">
          <p className="trust-band-label">Built for creators, page owners, and businesses</p>
          <div className="platform-pills">
            {PLATFORM_PILLS.map((platform) => {
              const PillIcon = platform.Icon;
              return (
                <span className="platform-pill" key={platform.name}>
                  {platform.type === 'img' ? (
                    <img src={platform.icon} alt="" width={20} height={20} />
                  ) : (
                    <PillIcon className="platform-pill-icon" />
                  )}
                  {platform.name}
                </span>
              );
            })}
          </div>
          <div className="stat-cards">
            <article className="stat-card reveal">
              <div className="stat-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="stat-card-num">
                <span data-count="2400" data-suffix="+"></span>
              </div>
              <div className="stat-card-lbl">Pages ready to earn</div>
              <span className="stat-card-dots" aria-hidden="true" />
            </article>
            <article className="stat-card reveal d1">
              <div className="stat-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="stat-card-num accent">
                $<span data-count="1.2" data-dec="1" data-suffix="M+"></span>
              </div>
              <div className="stat-card-lbl">Creator earning potential</div>
              <span className="stat-card-dots" aria-hidden="true" />
            </article>
            <article className="stat-card reveal d2">
              <div className="stat-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="stat-card-num">
                <span data-count="6"></span>
              </div>
              <div className="stat-card-lbl">Platforms supported</div>
              <span className="stat-card-dots" aria-hidden="true" />
            </article>
            <article className="stat-card reveal d3">
              <div className="stat-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17l.9-5.4L4.2 7.7l5.4-.8z" />
                </svg>
              </div>
              <div className="stat-card-num accent">
                <span data-count="4.9" data-dec="1"></span>/5
        </div>
              <div className="stat-card-lbl">Average creator experience</div>
              <span className="stat-card-dots" aria-hidden="true" />
            </article>
          </div>
        </div>
      </section>


      <section className="section section-soft platform-showcase">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">ONE PLATFORM · TWO SIDES</p>
            <h2 className="h2">Where brands and creators connect</h2>
            <p className="lead">Simple, trusted, and built for real collaborations.</p>
          </div>

          <div className="ps-layout reveal d1">
            <div className="ps-side ps-side--left">
              <article className="ps-card">
                <div className="ps-card-icon ps-card-icon--green" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                    <path d="M16 14h.01" />
                  </svg>
                </div>
                <h3>Secure Payments</h3>
                <p>Funds held until approval</p>
                <span className="ps-card-accent" aria-hidden="true" />
              </article>
              <article className="ps-card">
                <div className="ps-card-icon ps-card-icon--green" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="5" x2="5" y2="19" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                </div>
                <h3>Transparent Fee</h3>
                <p>Simple 15% commission</p>
                <span className="ps-card-accent" aria-hidden="true" />
              </article>
            </div>

            <div className="ps-hub">
              <div className="ps-hub-panel">
                <svg className="ps-hub-connector" viewBox="0 0 320 80" fill="none" aria-hidden="true">
                  <path d="M52 40 H132" stroke="rgba(255,255,255,.22)" strokeWidth="2" strokeDasharray="4 6" />
                  <path d="M188 40 H268" stroke="rgba(255,255,255,.22)" strokeWidth="2" strokeDasharray="4 6" />
                </svg>
                <div className="ps-hub-profiles">
                  <div className="ps-profile">
                    <img src="https://i.pravatar.cc/120?img=32" alt="" width={72} height={72} />
                    <span className="ps-badge ps-badge--creator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      Creator
                    </span>
                  </div>
                  <div className="ps-hub-shield" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <rect x="9" y="10" width="6" height="5" rx="1" />
                      <path d="M12 10V8" />
                    </svg>
                  </div>
                  <div className="ps-profile">
                    <img src="https://i.pravatar.cc/120?img=12" alt="" width={72} height={72} />
                    <span className="ps-badge ps-badge--brand">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      Brand
                    </span>
                  </div>
                </div>
                <div className="ps-budget-card">
                  <div className="ps-budget-top">
                    <div>
                      <div className="ps-budget-label">Campaign Budget</div>
                      <div className="ps-budget-amt">$25,000</div>
                    </div>
                    <svg className="ps-budget-chart" viewBox="0 0 120 48" fill="none" aria-hidden="true">
                      <path d="M4 38 L28 30 L52 34 L76 18 L100 10 L116 6" stroke="#00B86B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 38 L28 30 L52 34 L76 18 L100 10 L116 6 V44 H4 Z" fill="url(#psChartFill)" opacity=".25" />
                      <defs>
                        <linearGradient id="psChartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00B86B" />
                          <stop offset="100%" stopColor="#00B86B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="ps-budget-foot">
                    <span className="ps-budget-lock" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <div className="ps-budget-status-container">
                      <h3 className="ps-budget-status">Funds held securely</h3>
                      <p className="ps-budget-status-description">Released on approval</p>
                    </div>
                    <span className="ps-budget-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ps-side ps-side--right">
              <article className="ps-card">
                <div className="ps-card-icon ps-card-icon--green" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3>Smart Search</h3>
                <p>Find the right creators fast</p>
                <span className="ps-card-accent" aria-hidden="true" />
              </article>
              <article className="ps-card">
                <div className="ps-card-icon ps-card-icon--blue" aria-hidden="true">
                  <img src="/landing/social/social-media.png" alt="" width={24} height={24} />
                </div>
                <h3>Verified Pages</h3>
                <p>Real audiences, real results</p>
                <span className="ps-card-accent" aria-hidden="true" />
              </article>
            </div>
          </div>

          <div className="ps-allinone reveal d2">
            <div className="ps-allinone-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" />
              </svg>
            </div>
            <div className="ps-allinone-platforms" aria-label="Supported platforms">
              <img src={HERO_SOCIAL_ICONS.ig} alt="Instagram" width={28} height={28} />
              <img src={HERO_SOCIAL_ICONS.tt} alt="TikTok" width={28} height={28} />
              <img src={HERO_SOCIAL_ICONS.yt} alt="YouTube" width={28} height={28} />
              <img src={HERO_SOCIAL_ICONS.fb} alt="Facebook" width={28} height={28} />
              <span className="ps-platform-icon"><XIcon /></span>
              <span className="ps-platform-icon ps-platform-icon--linkedin"><LinkedInIcon /></span>
            </div>
            <div className="ps-allinone-copy">
              <strong>All-in-One</strong>
              <span>6 platforms, one dashboard</span>
              <span className="ps-card-accent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>


      <section className="section audience brand" id="brands">
        <div className="container">
          <div className="a-copy reveal">
            <p className="eyebrow">FOR BRANDS &amp; ADVERTISERS</p>
            <h2 className="h2">Run influencer campaigns without the chaos</h2>
            <p className="lead" style={{ marginTop: '18px' }}>Stop chasing creators through DMs and spreadsheets. Brief once, discover the right partners, and pay only for promotions that actually go live.</p>
            <ul className="a-list">
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Find the right fit in minutes</b><span>Search by niche, platform, location, audience size and budget — see engagement and price upfront.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Post a brief, let creators apply</b><span>Set requirements and budget once; qualified creators come to you. Approve or decline with a click.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Pay only on verified results</b><span>Funds stay held until the creator posts and you approve the proof. No upfront risk.</span></div></li>
            </ul>
            <Link to="/auth/signup/advertiser" className="btn btn-primary btn-lg">Start a campaign <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </div>
          <div className="a-visual reveal d2">
            <div className="mock">
              <div className="mock-top"><span className="dot r"></span><span className="dot y"></span><span className="dot g"></span><span className="tt">Creator marketplace</span></div>
              <div className="mock-body">
                <div className="tr" style={{ borderColor: 'var(--indigo-200)', background: 'var(--indigo-50)' }}><svg viewBox="0 0 24 24" fill="none" stroke="#FF7A59" strokeWidth="2" style={{ width: '18px', height: '18px' }}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span style={{ fontSize: '.82rem', color: 'var(--slate-500)' }}>Fashion · Instagram · 50K–250K · Pakistan</span></div>
                <div className="tbl" style={{ marginTop: '12px' }}>
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=45" alt="" /><div><div className="nm">@maya.styles</div><div className="sub">128K · 6.4% eng · from $450</div></div><span className="pill ok">Verified</span></div>
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=24" alt="" /><div><div className="nm">@aiza.daily</div><div className="sub">92K · 5.1% eng · from $320</div></div><span className="pill ok">Verified</span></div>
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=20" alt="" /><div><div className="nm">@styled.by.h</div><div className="sub">210K · 4.7% eng · from $680</div></div><span className="pill ok">Verified</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft creator-section" id="creators">
        <div className="container creator-section-grid">
          <div className="creator-visual reveal">
            <div className="creator-visual-stage">
              <span className="cv-blob" aria-hidden="true" />
              <span className="cv-doodle cv-doodle--tr" aria-hidden="true">
                <svg viewBox="0 0 80 48" fill="none"><path d="M8 36 C24 8, 40 40, 72 12" stroke="#00B86B" strokeWidth="2.5" strokeLinecap="round" opacity=".45" /></svg>
              </span>
              <img
                className="cv-photo"
                src="/landing/social/people.png"
                alt="Creators collaborating with brands"
              />
              <div className="cv-earnings">
                <span className="cv-heart" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.2-4.35-8.5-7.8C1.7 10.2 3.2 6.5 6.6 6c1.7-.3 3.3.4 4.4 1.7C12.1 6.4 13.7 5.7 15.4 6c3.4.5 4.9 4.2 3.1 7.2C18.2 16.65 12 21 12 21z" /></svg>
                </span>
                <div className="cv-earnings-copy">
                  <div className="cv-earnings-label">Earnings this month</div>
                  <div className="cv-earnings-amt">$3,840</div>
                  <span className="cv-earnings-badge">↑ 28% vs last month</span>
                </div>
                <div className="cv-earnings-bars" aria-hidden="true">
                  <i style={{ height: '42%' }} /><i style={{ height: '58%' }} /><i style={{ height: '48%' }} /><i className="hi" style={{ height: '78%' }} />
                </div>
              </div>
              <div className="cv-brands-pill">
                <span className="cv-brands-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                Paid by brands you love
                <span className="cv-brands-heart" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.2-4.35-8.5-7.8C1.7 10.2 3.2 6.5 6.6 6c1.7-.3 3.3.4 4.4 1.7C12.1 6.4 13.7 5.7 15.4 6c3.4.5 4.9 4.2 3.1 7.2C18.2 16.65 12 21 12 21z" /></svg>
                </span>
          </div>
            </div>
          </div>

          <div className="creator-copy reveal d1">
            <p className="eyebrow">FOR CREATORS &amp; PAGE OWNERS</p>
            <h2 className="h2">Turn your audience into income</h2>
            <p className="lead">List your pages, receive brand offers, and get paid with ease.</p>
            <ul className="creator-features">
              <li>
                <span className="creator-feature-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                  </svg>
                </span>
                List your pages for free
              </li>
              <li>
                <span className="creator-feature-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" />
                  </svg>
                </span>
                Get matched with brands
              </li>
              <li>
                <span className="creator-feature-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                Fast, secure payouts
              </li>
            </ul>
            <Link to="/auth/signup/creator" className="btn btn-green btn-lg">
              Join as a Creator
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>


      <section className="section hiw-section">
        <div className="container hiw-grid">
          <div className="hiw-left">
            <div className="hiw-copy reveal">
              <p className="eyebrow">HOW IT WORKS</p>
              <h2 className="h2">Start earning in 4 simple steps</h2>
              <p className="lead">Connect your page, get matched with brands, publish, and get paid.</p>
              <Link to="/how-it-works" className="btn btn-hiw">
                See how it works
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>

            <div className="hiw-visual reveal d1">
              <div className="hiw-visual-stage">
                <span className="hiw-blob hiw-blob--main" aria-hidden="true" />
                <span className="hiw-blob hiw-blob--soft" aria-hidden="true" />
                <span className="hiw-spark hiw-spark--1" aria-hidden="true">✦</span>
                <span className="hiw-spark hiw-spark--2" aria-hidden="true">✦</span>
                <span className="hiw-spark hiw-spark--3" aria-hidden="true">✦</span>
                <span className="hiw-squiggle" aria-hidden="true">
                  <svg viewBox="0 0 120 64" fill="none"><path d="M8 48 C28 12, 52 56, 112 20" stroke="#00B86B" strokeWidth="2.5" strokeLinecap="round" opacity=".5" /></svg>
                </span>

                <div className="hiw-phone-wrap">
                  <div className="hiw-phone">
                    <div className="hiw-phone-screen">
                      <div className="hiw-phone-head">Myplyn</div>

                      <div className="hiw-notice-bar">
                        <span className="hiw-notice-text">New brand offer</span>
                        <span className="hiw-notice-bell" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </span>
                      </div>

                      <div className="hiw-offer-card">
                        <div className="hiw-offer-product" aria-hidden="true">
                          <svg viewBox="0 0 200 140" fill="none">
                            <path d="M-10 92 C30 72, 50 108, 90 88 S150 72, 210 92" fill="#D6E4F7" opacity=".85" />
                            <path d="M20 118 C55 98, 85 126, 120 106 S165 94, 200 112" fill="#C5D8F2" opacity=".7" />
                            <circle cx="168" cy="28" r="14" fill="#93C5FD" opacity=".55" />
                            <path d="M88 34h24l5 16H83l5-16z" fill="#93C5FD" />
                            <path d="M82 50h36v58c0 8-8 14-18 14s-18-6-18-14V50z" fill="url(#hiwBottle)" />
                            <rect x="96" y="22" width="14" height="14" rx="4" fill="#60A5FA" />
                            <defs>
                              <linearGradient id="hiwBottle" x1="100" y1="50" x2="100" y2="122" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#BFDBFE" /><stop offset="1" stopColor="#3B82F6" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className="hiw-offer-lines" aria-hidden="true">
                          <span /><span />
                        </div>
                        <button type="button" className="hiw-offer-btn">View offer</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hiw-earnings">
                  <span className="hiw-earnings-heart" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.2-4.35-8.5-7.8C1.7 10.2 3.2 6.5 6.6 6c1.7-.3 3.3.4 4.4 1.7C12.1 6.4 13.7 5.7 15.4 6c3.4.5 4.9 4.2 3.1 7.2C18.2 16.65 12 21 12 21z" /></svg>
                  </span>
                  <div className="hiw-earnings-main">
                    <div className="hiw-earnings-label">Earnings this month</div>
                    <div className="hiw-earnings-amt">$3,840</div>
                    <span className="hiw-earnings-badge">↑ 28% vs last month</span>
                  </div>
                  <div className="hiw-earnings-bars" aria-hidden="true">
                    <i style={{ height: '38%' }} /><i style={{ height: '52%' }} /><i style={{ height: '44%' }} /><i className="hi" style={{ height: '72%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hiw-steps reveal d2">
            <svg className="hiw-connector" viewBox="0 0 48 360" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M22 36 C4 66, 4 96, 22 126 C40 156, 40 186, 22 216 C4 246, 4 276, 22 306" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="hiw-step">
              <span className="hiw-step-num">1</span>
              <span className="hiw-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <span className="hiw-step-label">Connect your page</span>
            </div>

            <div className="hiw-step">
              <span className="hiw-step-num">2</span>
              <span className="hiw-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </span>
              <span className="hiw-step-label">Get brand offers</span>
            </div>

            <div className="hiw-step hiw-step--active">
              <span className="hiw-step-num">3</span>
              <span className="hiw-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </span>
              <span className="hiw-step-label">Publish content</span>
            </div>

            <div className="hiw-step">
              <span className="hiw-step-num">4</span>
              <span className="hiw-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <span className="hiw-step-label">Get paid</span>
            </div>
          </div>
        </div>
      </section>


      <section className="section marketplace-section">
          <div className="container">
            <div className="section-head center reveal">
            <p className="eyebrow">DISCOVER CREATORS ✦</p>
            <h2 className="h2">Find creators that fit your brand</h2>
            <p className="lead">Browse real pages, niches, and engagement at a glance.</p>
          </div>

          <div className="reveal d1">
            <DiscoverCreatorsCarousel />
          </div>
        </div>
      </section>


      <section className="section testimonial-section">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow tr-eyebrow">
              TRUSTED RESULTS
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </p>
            <h2 className="h2">Real partnerships. Real payouts.</h2>
            <p className="lead">Simple, transparent collaboration for both sides.</p>
          </div>

          <div className="tr-grid">
            {TESTIMONIALS.map((item, index) => (
              <article className={`tr-card reveal${index ? ` d${index}` : ''}`} key={item.name}>
                <TestimonialStars />
                <p className="tr-quote">{item.quote}</p>
                <div className="tr-card-foot">
                  <div className="tr-who">
                    <img src={item.img} alt="" />
                    <div>
                      <div className="tr-name">{item.name}</div>
                      <div className="tr-role">{item.role}</div>
            </div>
            </div>
                  <span className="tr-mark" aria-hidden="true">”</span>
            </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="section pricing-section">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">SIMPLE PRICING</p>
            <h2 className="h2 pr-title">
              <span className="pr-hl">Free</span> for creators. <span className="pr-hl">15%</span> for brands.
            </h2>
            <p className="lead">Creators join for free. Brands only pay a flat fee when a collaboration is completed.</p>
          </div>

          <div className="pr-grid reveal d1">
            <article className="pr-card pr-card--creator">
              <div className="pr-card-main">
                <div className="pr-card-head">
                  <span className="pr-icon pr-icon--green" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <div>
                    <div className="pr-label pr-label--green">For Creators</div>
                    <div className="pr-price">Free</div>
                    <p className="pr-sub">Join and list your pages</p>
                  </div>
                </div>
                <ul className="pr-features">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                    List your pages for free
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    Receive brand offers
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Get paid fast
                  </li>
                </ul>
                <Link to="/auth/signup/creator" className="btn btn-green pr-btn">
                  Join as a Creator
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
              <div className="pr-visual" aria-hidden="true">
                <span className="pr-visual-circle" />
                <img src="/landing/social/girl.png" alt="" />
                <div className="pr-earnings-mini">
                  <span className="pr-earnings-label">Earnings</span>
                  <strong>$2,450</strong>
                  <svg className="pr-earnings-chart" viewBox="0 0 80 32" fill="none">
                    <path d="M4 24 L20 18 L34 22 L52 10 L76 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </article>

            <article className="pr-card pr-card--brand">
              <div className="pr-card-head">
                <span className="pr-icon pr-icon--navy" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
                  </svg>
                </span>
                <div>
                  <div className="pr-label pr-label--navy">For Brands</div>
                  <div className="pr-price">15%</div>
                  <p className="pr-sub">Flat fee per completed collaboration</p>
                </div>
              </div>

              <div className="pr-breakdown">
                <span><strong>$500</strong> budget</span>
                <span className="pr-breakdown-arrow" aria-hidden="true">→</span>
                <span><strong>$75</strong> fee</span>
                <span className="pr-breakdown-arrow" aria-hidden="true">→</span>
                <span className="pr-breakdown-hi"><strong>$425</strong> creator earnings</span>
            </div>

              <ul className="pr-features pr-features--navy">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  Browse creators
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                  Launch campaigns
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  Pay only on completed deals
                </li>
              </ul>

              <Link to="/auth/signup/advertiser" className="btn btn-pr-outline pr-btn">
                Start a Campaign
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </article>
          </div>

          <div className="pr-benefits reveal d2">
            <div className="pr-benefit">
              <span className="pr-benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </span>
              <div>
                <strong>No monthly fees</strong>
                <span>Pay only when results happen.</span>
              </div>
            </div>
            <div className="pr-benefit">
              <span className="pr-benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              </span>
              <div>
                <strong>Transparent pricing</strong>
                <span>No hidden charges. Ever.</span>
              </div>
            </div>
            <div className="pr-benefit">
              <span className="pr-benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <div>
                <strong>Secure payouts</strong>
                <span>Fast, safe, and reliable payments.</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section faq-section">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2">Good to know</h2>
          </div>
          <div className="faq reveal">
            <div className="qa"><button>How do creators get paid?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Creators are paid through secure payout rails once collaboration proof is approved by the brand.</p></div></div>
            <div className="qa"><button>Is it free to join?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Yes. Creators can join and list pages for free. Brands only pay a flat fee on completed collaborations.</p></div></div>
            <div className="qa"><button>Which platforms can I connect?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Instagram, TikTok, YouTube, X, Facebook, and LinkedIn are currently supported.</p></div></div>
            <div className="qa"><button>How long does approval take?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Most submissions are reviewed quickly, often within the same day once required proof is submitted.</p></div></div>
            <div className="qa"><button>Can I add more pages later?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Absolutely. You can add additional pages anytime from your dashboard.</p></div></div>
          </div>
        </div>
      </section>


      <section className="section join-banner-section">
        <div className="container">
          <div className="join-banner reveal">
            <div className="join-copy">
              <p className="eyebrow">READY TO JOIN?</p>
              <h2>Turn your page into income.</h2>
              <p>Join Myplyn and start getting discovered by businesses looking for creators like you.</p>
            <div className="hero-cta">
                <Link to="/auth/signup/creator" className="btn btn-green btn-lg">Join as a Creator</Link>
                <Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a Business</Link>
              </div>
            </div>
            <div className="join-art" aria-hidden="true">
              <img src="/landing/social/image9.png" alt="" />
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
