import { Link } from 'react-router-dom';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const pricingSteps = [
  {
    num: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: 'Create your campaign',
    highlight: 'Free',
    text: 'Create unlimited campaigns and invite creators.',
  },
  {
    num: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    title: 'Set your campaign budget',
    text: 'You decide how much you want to invest.',
    chips: ['₪500', '₪2,000', '₪10,000', '₪50,000+'],
  },
  {
    num: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    title: 'Platform fee',
    highlight: '10% – 20%',
    text: 'The rate depends on campaign size, duration, and other factors.',
  },
];

const feeRows = [
  { budget: '₪1,000', fee: '₪100 – ₪200', total: '₪1,100 – ₪1,200' },
  { budget: '₪5,000', fee: '₪500 – ₪1,000', total: '₪5,500 – ₪6,000' },
  { budget: '₪10,000', fee: '₪1,000 – ₪2,000', total: '₪11,000 – ₪12,000' },
  { budget: '₪50,000', fee: '₪5,000 – ₪10,000', total: '₪55,000 – ₪60,000' },
];

const creatorBenefits = [
  'Join for free',
  'No monthly fees',
  'Browse unlimited campaigns',
  'Apply to campaigns you like',
  'Get paid directly to your account',
  'Keep 100% of your earnings',
];

const creatorAvatars = [
  'https://i.pravatar.cc/80?img=47',
  'https://i.pravatar.cc/80?img=32',
  'https://i.pravatar.cc/80?img=45',
  'https://i.pravatar.cc/80?img=24',
];

const includedFeatures = [
  {
    title: 'AI Campaign Matching',
    text: 'Match with the right creators using smart AI.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
    ),
  },
  {
    title: 'Secure Payments',
    text: 'Funds held safely until work is approved.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="11" width="6" height="5" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Performance Analytics',
    text: 'Track campaign results in real time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 6-7 4 5" />
      </svg>
    ),
  },
  {
    title: 'Fraud Protection',
    text: 'Verified creators and secure workflows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Direct Messaging',
    text: 'Chat with creators in one place.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Creator Discovery',
    text: 'Search and filter creators by niche.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8a3 3 0 0 0-3 3" />
      </svg>
    ),
  },
  {
    title: 'Customer Support',
    text: 'Dedicated help when you need it.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3v-7z" />
        <path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v-7z" />
        <path d="M12 3a5 5 0 0 1 5 5v1" />
      </svg>
    ),
  },
];

const faqItems = [
  {
    q: 'Do I pay to register?',
    a: 'No. Registration is completely free for both businesses and creators. You can sign up, browse, and explore the platform without any upfront cost.',
  },
  {
    q: 'When does Myplyn earn money?',
    a: 'Myplyn earns a platform fee of 10%–20% only when your campaign runs successfully. We only make money when your campaign delivers results.',
  },
  {
    q: 'Do creators pay anything to use Myplyn?',
    a: 'No. Creators join for free and keep 100% of their campaign earnings. There are no monthly fees or hidden charges for creators.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No hidden fees. The platform fee (10%–20%) is included in your total payment. What you see in your campaign budget is what you pay.',
  },
  {
    q: 'Do businesses pay a monthly fee?',
    a: 'No monthly subscriptions. Businesses only pay when they launch and run campaigns. Creating campaigns and inviting creators is always free.',
  },
  {
    q: 'Can I cancel a campaign?',
    a: 'Yes. You can cancel a campaign before it goes live. If work has not been completed or approved, held funds are returned to your account.',
  },
];

export default function LandingPricing() {
  return (
    <>
      <section className="pricing-ref-hero">
        <div className="container">
          <div className="pricing-ref-hero-stage reveal">
            <img
              className="pricing-ref-hero-art pricing-ref-hero-art--left"
              src="/landing/social/pie_chart_card_dotted.svg"
              alt=""
              aria-hidden="true"
            />
            <img
              className="pricing-ref-hero-art pricing-ref-hero-art--right"
              src="/landing/social/growth_chart_card_exact_style.svg"
              alt=""
              aria-hidden="true"
            />

            <div className="pricing-ref-hero-copy">
              <p className="pricing-ref-hero-badge">TRANSPARENT PRICING</p>
              <h1 className="h1">Simple. Transparent. Fair.</h1>
              <p className="pricing-ref-hero-tagline">
                Pay only when <span>your campaign runs.</span>
              </p>
              <ul className="pricing-ref-hero-points">
                <li>No subscriptions</li>
                <li>No setup fees</li>
                <li>No hidden costs</li>
              </ul>
              <p className="lead">
                Myplyn is a marketplace that connects businesses with the right creators.
                We only earn when your campaign is successful.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-ref-steps-section">
        <div className="container">
          <div className="section-head center reveal">
            <h2 className="h2">How pricing works</h2>
          </div>
          <div className="pricing-ref-steps reveal d1">
            {pricingSteps.map((step) => (
              <article key={step.title} className="pricing-ref-step-card">
                <span className="pricing-ref-step-num">{step.num}</span>
                <span className="pricing-ref-step-ico" aria-hidden="true">{step.icon}</span>
                <h3>{step.title}</h3>
                {step.highlight && <div className="pricing-ref-step-hi">{step.highlight}</div>}
                <p>{step.text}</p>
                {step.chips && (
                  <div className="pricing-ref-chips">
                    {step.chips.map((chip) => (
                      <span key={chip} className="pricing-ref-chip">{chip}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-ref-detail-section">
        <div className="container">
          <div className="pricing-ref-detail-grid">
            <article className="pricing-ref-fee-card reveal">
              <h2 className="h3">Platform fee (10% – 20%)</h2>
              <p className="pricing-ref-fee-sub">
                Charged only when your campaign runs successfully. The fee is included in your total investment.
              </p>
              <div className="pricing-ref-table-wrap">
                <table className="pricing-ref-table">
                  <thead>
                    <tr>
                      <th>Campaign Budget</th>
                      <th>Platform Fee (10% – 20%)</th>
                      <th>Total Investment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRows.map((row) => (
                      <tr key={row.budget}>
                        <td>{row.budget}</td>
                        <td>{row.fee}</td>
                        <td>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pricing-ref-fee-note">
                The platform fee is included in your total payment. No additional fees will be charged.
              </div>
            </article>

            <article className="pricing-ref-creator-card reveal d1">
              <h2 className="h3">For Creators</h2>
              <div className="pricing-ref-creator-hi">Always Free</div>
              <ul className="pricing-ref-creator-list">
                {creatorBenefits.map((item) => (
                  <li key={item}>
                    <span className="pricing-ref-check" aria-hidden="true"><CheckIcon /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pricing-ref-creator-foot" aria-hidden="true">
                <div className="pricing-ref-avatars">
                  {creatorAvatars.map((src) => (
                    <img key={src} src={src} alt="" />
                  ))}
                </div>
                <span className="pricing-ref-heart">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="pricing-ref-included-section">
        <div className="container">
          <div className="section-head center reveal">
            <h2 className="h2">Everything you need. Included.</h2>
          </div>
          <div className="pricing-ref-included-grid reveal d1">
            {includedFeatures.map((feature) => (
              <div key={feature.title} className="pricing-ref-included-item">
                <span className="pricing-ref-included-ico" aria-hidden="true">{feature.icon}</span>
                <strong>{feature.title}</strong>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-ref-faq-section">
        <div className="container">
          <div className="section-head center reveal">
            <h2 className="h2">Frequently asked questions</h2>
          </div>
          <div className="pricing-ref-faq-grid reveal d1">
            {faqItems.map((item) => (
              <div key={item.q} className="qa">
                <button type="button">
                  {item.q}
                  <span className="q-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className="ans"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-ref-cta">
        <div className="container">
          <div className="pricing-ref-cta-band reveal">
            <div className="pricing-ref-cta-left">
              <img
                className="pricing-ref-cta-target"
                src="/landing/social/target_arrow_icon.svg"
                alt=""
                aria-hidden="true"
              />
              <div className="pricing-ref-cta-copy">
                <h3>Ready to grow your business?</h3>
                <p>Create your first campaign in less than 2 minutes.</p>
                <ul className="pricing-ref-cta-points">
                  <li>Free to join</li>
                  <li>No credit card required</li>
                  <li>Cancel anytime</li>
                </ul>
              </div>
            </div>
            <div className="pricing-ref-cta-actions">
              <Link to="/auth/signup/advertiser" className="btn btn-green btn-lg">
                Start Your First Campaign
              </Link>
              <Link to="/auth/signup/creator" className="btn btn-outline btn-lg pricing-ref-cta-outline">
                Join as a Creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
