import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function LandingPricing() {
  return (
    <>
      <section className="page-hero">
        <div className="hero-bg"><span className="blob b1"></span><span className="blob b2"></span></div>
        <div className="container">
          <p className="eyebrow reveal">PRICING</p>
          <h1 className="h1 reveal d1" style={{ marginTop: '14px' }}>No subscriptions.<br />One flat 15%.</h1>
          <p className="lead reveal d2">It's free to join, browse and list. We only earn a commission when a collaboration is successfully completed — so we win only when you do.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="price-wrap">
            <div className="price-card hero-price reveal">
              <span className="tag">FOR BRANDS</span>
              <div className="big">15%<small> per completed campaign</small></div>
              <p style={{ opacity: '.85' }}>Browse creators and post briefs for free. You only fund a campaign when you launch it, and you only pay for promotions that go live.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Unlimited creator search &amp; filters</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Post open briefs &amp; receive applications</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Funds held until you approve the proof</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Full campaign history &amp; invoices</li>
              </ul>
              <Link to="/auth/signup/advertiser" className="btn btn-white btn-block">Start a campaign</Link>
            </div>
            <div className="price-card reveal d1">
              <span className="tag" style={{ color: 'var(--coral-600)' }}>FOR CREATORS</span>
              <div className="big">Free<small> to join &amp; list</small></div>
              <p style={{ color: 'var(--slate-500)' }}>List your pages and accept deals at no cost. The 15% is taken from completed collaborations — and you always see your net first.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>List unlimited pages across six platforms</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Keep 85% of every collaboration</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Fast Stripe payouts, typically within 48h</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>See net earnings before you accept</li>
              </ul>
              <Link to="/auth/signup/creator" className="btn btn-accent btn-block">Create free profile</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft" style={{ paddingBlock: '72px' }}>
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">THE MATH, IN PLAIN TERMS</p>
            <h2 className="h2">Exactly where every dollar goes</h2>
          </div>
          <div className="price-wrap" style={{ marginTop: '40px' }}>
            <div className="price-card reveal">
              <span className="tag" style={{ color: 'var(--indigo-600)' }}>A $500 CAMPAIGN</span>
              <div className="math" style={{ background: 'var(--indigo-50)', color: 'var(--ink)', marginTop: '18px' }}>
                <div className="m"><div className="v" style={{ color: 'var(--indigo-600)' }}>$500</div><div className="k" style={{ color: 'var(--slate-500)' }}>Brand funds</div></div>
                <div className="op">−</div>
                <div className="m"><div className="v" style={{ color: 'var(--coral-600)' }}>$75</div><div className="k" style={{ color: 'var(--slate-500)' }}>Platform 15%</div></div>
                <div className="op">=</div>
                <div className="m"><div className="v" style={{ color: 'var(--success)' }}>$425</div><div className="k" style={{ color: 'var(--slate-500)' }}>Creator earns</div></div>
              </div>
              <p style={{ marginTop: '18px', color: 'var(--slate-500)', fontSize: '.95rem' }}>The brand knows the all-in cost upfront. The creator sees the $425 net before accepting. Nothing is hidden.</p>
            </div>
            <div className="price-card reveal d1">
              <span className="tag" style={{ color: 'var(--indigo-600)' }}>A $2,000 CAMPAIGN</span>
              <div className="math" style={{ background: 'var(--indigo-50)', color: 'var(--ink)', marginTop: '18px' }}>
                <div className="m"><div className="v" style={{ color: 'var(--indigo-600)' }}>$2,000</div><div className="k" style={{ color: 'var(--slate-500)' }}>Brand funds</div></div>
                <div className="op">−</div>
                <div className="m"><div className="v" style={{ color: 'var(--coral-600)' }}>$300</div><div className="k" style={{ color: 'var(--slate-500)' }}>Platform 15%</div></div>
                <div className="op">=</div>
                <div className="m"><div className="v" style={{ color: 'var(--success)' }}>$1,700</div><div className="k" style={{ color: 'var(--slate-500)' }}>Creator earns</div></div>
              </div>
              <p style={{ marginTop: '18px', color: 'var(--slate-500)', fontSize: '.95rem' }}>The same flat rate at any budget. No tiers, no surprises, whether it's one post or a multi-creator campaign.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">PRICING FAQ</p><h2 className="h2">Questions about fees</h2></div>
          <div className="faq reveal">
            <div className="qa"><button>Is there a monthly subscription?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>No. There's no monthly or annual fee for either side. Joining, browsing creators, and listing pages are all free. The only charge is a flat 15% commission on completed collaborations.</p></div></div>
            <div className="qa"><button>When is the 15% charged?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Only when a collaboration is successfully completed and verified. It's deducted from the campaign amount, so the creator receives 85% as their net payout.</p></div></div>
            <div className="qa"><button>What happens if a campaign is cancelled?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>If a promotion never goes live or isn't approved, the held funds are returned to the brand. The commission only applies to completed work.</p></div></div>
            <div className="qa"><button>Are there any payment processing fees?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>The 15% is the platform commission. Standard Stripe processing applies to card payments and payouts, as it would on any platform — we keep this transparent at checkout.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container"><div className="cta-band reveal">
          <h2>Transparent from day one</h2>
          <p>No contracts, no setup fees. Create an account and only pay when there's real work to show for it.</p>
          <div className="hero-cta"><Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a brand</Link><Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link></div>
        </div></div>
      </section>
    </>
  );
}
