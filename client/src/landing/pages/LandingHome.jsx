import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function LandingHome() {
  return (
    <>





      <section className="hero" data-toggle>
        <div className="hero-bg">
          <span className="blob b1"></span><span className="blob b2"></span><span className="blob b3"></span>
        </div>
        <div className="container">
          <div className="hero-copy">
            <div className="toggle" data-hero role="tablist" aria-label="Choose your view">
              <button className="on" data-view="brand">For brands</button>
              <button data-view="creator">For creators</button>
            </div>
            <p className="eyebrow" data-hero data-brand="FOR BRANDS & ADVERTISERS" data-creator="FOR CREATORS & PAGE OWNERS" style={{ marginTop: '22px' }}>FOR BRANDS &amp; ADVERTISERS</p>
            <h1 data-hero>
              <span data-brand="Launch creator campaigns that " data-creator="Turn your audience into ">Launch creator campaigns that </span><span className="hl" data-brand="convert." data-creator="income.">convert.</span>
            </h1>
            <p className="lead" data-hero data-brand="Find vetted creators across six platforms, brief them in minutes, and only release payment once the post is live and approved." data-creator="List your pages for free, get matched with brands that fit your niche, and get paid fast — you keep 85% of every deal.">Find vetted creators across six platforms, brief them in minutes, and only release payment once the post is live and approved.</p>
            <div className="hero-cta" data-hero>
              <Link to="/auth/signup/advertiser" className="btn btn-primary btn-lg"><span data-brand="Start a campaign" data-creator="Join as a creator">Start a campaign</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
              <Link to="/how-it-works" className="btn btn-outline btn-lg">See how it works</Link>
            </div>
            <p className="hero-meta" data-hero>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              No subscriptions · 15% flat fee · Funds held safely until approved
            </p>
          </div>

          
          <div className="mock-stage" data-hero>
            <div className="mock">
              <div className="mock-top"><span className="dot r"></span><span className="dot y"></span><span className="dot g"></span><span className="tt">Campaign dashboard</span></div>
              <div className="mock-body">
                <div className="mk-row">
                  <div className="kpi"><div className="k-label">Live campaigns</div><div className="k-num in">8</div></div>
                  <div className="kpi"><div className="k-label">In review</div><div className="k-num">3</div></div>
                  <div className="kpi"><div className="k-label">Held in escrow</div><div className="k-num up">$4.2k</div></div>
                </div>
                <div className="chart">
                  <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF7A59" stopOpacity=".25"/><stop offset="1" stopColor="#FF7A59" stopOpacity="0"/></linearGradient></defs>
                    <path d="M0 92 C40 86 60 60 96 64 C140 69 150 30 196 38 C240 46 260 18 320 22 L320 120 L0 120 Z" fill="url(#g)"/>
                    <path d="M0 92 C40 86 60 60 96 64 C140 69 150 30 196 38 C240 46 260 18 320 22" fill="none" stroke="#FF7A59" strokeWidth="2.5"/>
                  </svg>
                </div>
                <div className="tbl">
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=47" alt="" /><div><div className="nm">@maya.styles</div><div className="sub">Instagram · Fashion</div></div><span className="pill ok">Verified</span></div>
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=12" alt="" /><div><div className="nm">@techwithleo</div><div className="sub">YouTube · Tech</div></div><span className="pill live">Live</span></div>
                  <div className="tr"><img src="https://i.pravatar.cc/80?img=32" alt="" /><div><div className="nm">@thefitnoah</div><div className="sub">TikTok · Fitness</div></div><span className="pill pend">In review</span></div>
                </div>
              </div>
            </div>
            
            <div className="float creator">
              <div className="fc-head"><img src="https://i.pravatar.cc/80?img=5" alt="" />
                <div><div className="fc-name">Maya R. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div>
                <div className="fc-sub">Fashion · Karachi</div></div></div>
              <div className="fc-stats"><div><b>128K</b>followers</div><div><b>6.4%</b>engagement</div></div>
            </div>
            
            <div className="float pay">
              <div className="amt-label">Payout released</div>
              <div className="amt">$1,275</div>
              <div className="fc-sub" style={{ marginTop: '4px' }}>Net to creator · paid in 48h</div>
            </div>
          </div>
        </div>
      </section>


      <section className="trust">
        <div className="container">
          <p className="t-label">TRUSTED BY MODERN BRANDS &amp; CREATORS</p>
          <div className="logos">
            <span className="lg">▲ Northwind</span>
            <span className="lg">Lumen&amp;Co</span>
            <span className="lg">Brightpeak</span>
            <span className="lg">Studio Forma</span>
            <span className="lg">Vela</span>
            <span className="lg">Habit</span>
          </div>
        </div>
      </section>


      <section className="section" style={{ paddingBlock: '64px' }}>
        <div className="container">
          <div className="stats">
            <div className="stat reveal"><div className="num"><span data-count="2400" data-suffix="+"></span></div><div className="lbl">Verified creators onboarded</div></div>
            <div className="stat reveal d1"><div className="num">$<span data-count="1.2" data-dec="1" data-suffix="M+"></span></div><div className="lbl">Paid out to creators</div></div>
            <div className="stat reveal d2"><div className="num"><span data-count="6"></span></div><div className="lbl">Social platforms in one place</div></div>
            <div className="stat reveal d3"><div className="num"><span data-count="4.9" data-dec="1"></span></div><div className="lbl">Average partner rating</div></div>
          </div>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">ONE PLATFORM · TWO SIDES</p>
            <h2 className="h2">Where brands and creators actually meet</h2>
            <p className="lead">Most influencer tools are built for one side and bolt the other on. {BRAND.name} is designed for both — a fair, transparent marketplace where finding a partner and getting paid are equally easy.</p>
          </div>

          <div className="bento">
            <div className="card feature reveal">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
              <h3>Funds held until you approve</h3>
              <p>Brands fund campaigns upfront; creators see the money is secured. Payment only releases when the post is live and verified — protection for both sides.</p>
            </div>
            <div className="card small reveal d1">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></div>
              <h3>Powerful search</h3>
              <p>Filter by country, city, platform, niche, followers, reach and price range.</p>
            </div>
            <div className="card small reveal d2">
              <div className="ico coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17l.9-5.4L4.2 7.7l5.4-.8z"/></svg></div>
              <h3>Verified creators</h3>
              <p>Real audiences and reviewed stats — vetted before they reach you.</p>
            </div>
            <div className="card small reveal">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="3"/><path d="M2 9h20"/></svg></div>
              <h3>Transparent 15%</h3>
              <p>No subscriptions, no hidden fees. One flat commission on completed deals.</p>
            </div>
            <div className="card small reveal d1">
              <div className="ico coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h12"/></svg></div>
              <h3>Six platforms, one dashboard</h3>
              <p>Instagram, TikTok, YouTube, X, Facebook and LinkedIn in a single workflow.</p>
            </div>
            <div className="card small reveal d2">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <h3>Built-in messaging</h3>
              <p>Brief, negotiate and share assets without leaving the platform.</p>
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


      <section className="section section-soft audience creator flip" id="creators">
        <div className="container">
          <div className="a-copy reveal">
            <p className="eyebrow coral">FOR CREATORS &amp; PAGE OWNERS</p>
            <h2 className="h2">Get paid what your audience is worth</h2>
            <p className="lead" style={{ marginTop: '18px' }}>List your pages for free and let brands come to you. Clear offers, secure payments, and money in your account fast — no awkward price negotiations or chasing invoices.</p>
            <ul className="a-list">
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>List every page in one profile</b><span>Add all your platforms, niches and rates. One profile works across Instagram, TikTok, YouTube and more.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Get matched, not ghosted</b><span>Receive campaign invites that fit your niche and apply to open briefs with a single tap.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Keep 85%, paid in 48 hours</b><span>Submit proof, get verified, and receive a fast Stripe payout. You always see the net before you accept.</span></div></li>
            </ul>
            <Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </div>
          <div className="a-visual reveal d2">
            <div className="earn">
              <div className="e-top"><div><div className="lbl">THIS MONTH</div><div className="big">$3,840</div><div className="delta">▲ 28% vs last month</div></div>
                <span className="pill ok" style={{ fontSize: '.72rem' }}>Payouts active</span></div>
              <div className="bars"><i style={{ height: '40%' }}></i><i style={{ height: '62%' }}></i><i style={{ height: '48%' }}></i><i style={{ height: '78%' }}></i><i className="hi" style={{ height: '96%' }}></i><i style={{ height: '70%' }}></i></div>
              <div className="row"><span>Collaboration · @brand.northwind</span><span className="net">+$1,275 net</span></div>
              <div className="row"><span>Platform fee (15%)</span><span style={{ color: 'var(--slate-400)' }}>–$225</span></div>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="steps">
            <div className="steps-sticky">
              <p className="eyebrow reveal">HOW IT WORKS</p>
              <h2 className="h2 reveal" style={{ marginTop: '14px' }}>From brief to payout, in one flow</h2>
              <p className="lead reveal d1" style={{ marginTop: '16px' }}>A single, transparent workflow keeps brands and creators moving together — every step has a clear status both sides can see.</p>
              <Link to="/how-it-works" className="btn btn-outline reveal d2" style={{ marginTop: '26px' }}>See the full workflow
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
            </div>
            <div className="thread">
              <div className="step reveal"><span className="nodot">1</span><div><h3>Create &amp; fund a campaign</h3><p>Brands set requirements, budget and target audience, then fund the campaign upfront. The budget is held securely.</p></div></div>
              <div className="step reveal"><span className="nodot">2</span><div><h3>Discover &amp; invite creators</h3><p>Search the marketplace or post an open brief. Creators apply or accept invitations that fit their niche.</p></div></div>
              <div className="step reveal"><span className="nodot">3</span><div><h3>Publish &amp; submit proof</h3><p>The creator posts the promotion and submits proof — a live link or screenshot — right inside the platform.</p></div></div>
              <div className="step reveal"><span className="nodot">4</span><div><h3>Verify &amp; release payment</h3><p>The brand (or our team) verifies the post. Payment is released to the creator and the platform keeps a flat 15%.</p></div></div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container" style={{ maxWidth: 'none', paddingInline: '0' }}>
          <div className="container">
            <div className="section-head center reveal">
              <p className="eyebrow">THE MARKETPLACE</p>
              <h2 className="h2">Thousands of creators, every niche</h2>
              <p className="lead">From micro-influencers to large pages — discover partners with the audience, engagement and rates that fit your campaign.</p>
            </div>
          </div>
          <div className="marquee reveal" style={{ marginTop: '46px' }}>
            <div className="marquee-track">
              
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=45" alt="" /><div><div className="cc-name">Maya R. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Karachi · Fashion</div></div></div><div className="tags"><span className="tag">Instagram</span><span className="tag">Fashion</span></div><div className="cc-stats"><div><div className="n">128K</div><div className="l">followers</div></div><div><div className="n">6.4%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$450 <small>/ post</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=12" alt="" /><div><div className="cc-name">Leo M. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Dubai · Tech</div></div></div><div className="tags"><span className="tag">YouTube</span><span className="tag">Tech</span></div><div className="cc-stats"><div><div className="n">340K</div><div className="l">subscribers</div></div><div><div className="n">8.1%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$1,200 <small>/ video</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=32" alt="" /><div><div className="cc-name">Noah K. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">London · Fitness</div></div></div><div className="tags"><span className="tag">TikTok</span><span className="tag">Fitness</span></div><div className="cc-stats"><div><div className="n">512K</div><div className="l">followers</div></div><div><div className="n">9.3%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$680 <small>/ post</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=24" alt="" /><div><div className="cc-name">Aiza S. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Lahore · Beauty</div></div></div><div className="tags"><span className="tag">Instagram</span><span className="tag">Beauty</span></div><div className="cc-stats"><div><div className="n">92K</div><div className="l">followers</div></div><div><div className="n">5.1%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$320 <small>/ post</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=15" alt="" /><div><div className="cc-name">Sara T. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Toronto · Food</div></div></div><div className="tags"><span className="tag">YouTube</span><span className="tag">Food</span></div><div className="cc-stats"><div><div className="n">186K</div><div className="l">subscribers</div></div><div><div className="n">7.2%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$540 <small>/ video</small></span></div></article>
              
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=45" alt="" /><div><div className="cc-name">Maya R. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Karachi · Fashion</div></div></div><div className="tags"><span className="tag">Instagram</span><span className="tag">Fashion</span></div><div className="cc-stats"><div><div className="n">128K</div><div className="l">followers</div></div><div><div className="n">6.4%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$450 <small>/ post</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=12" alt="" /><div><div className="cc-name">Leo M. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">Dubai · Tech</div></div></div><div className="tags"><span className="tag">YouTube</span><span className="tag">Tech</span></div><div className="cc-stats"><div><div className="n">340K</div><div className="l">subscribers</div></div><div><div className="n">8.1%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$1,200 <small>/ video</small></span></div></article>
              <article className="cc"><div className="cc-head"><img src="https://i.pravatar.cc/120?img=32" alt="" /><div><div className="cc-name">Noah K. <svg className="v" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3 .2.9 2.9 2.3 1.9-1 2.8 1 2.8-2.3 1.9-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.4 15l1-2.8-1-2.8 2.3-1.9.9-2.9 3-.2z"/></svg></div><div className="cc-loc">London · Fitness</div></div></div><div className="tags"><span className="tag">TikTok</span><span className="tag">Fitness</span></div><div className="cc-stats"><div><div className="n">512K</div><div className="l">followers</div></div><div><div className="n">9.3%</div><div className="l">engagement</div></div></div><div className="from"><span className="price">$680 <small>/ post</small></span></div></article>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">LOVED BY BOTH SIDES</p>
            <h2 className="h2">Real partnerships, real payouts</h2>
          </div>
          <div className="quotes">
            <div className="quote reveal">
              <span className="badge brand">Brand</span>
              <div className="stars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg></div>
              <p>"We booked five creators in an afternoon and didn't release a cent until every post went live. It replaced a month of back-and-forth DMs."</p>
              <div className="who"><img src="https://i.pravatar.cc/80?img=51" alt="" /><div><div className="nm">Daniel Brooks</div><div className="rl">Growth Lead, Northwind</div></div></div>
            </div>
            <div className="quote reveal d1">
              <span className="badge creator">Creator</span>
              <div className="stars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg></div>
              <p>"I finally know what I'll earn before I accept, and the payout hit my account in two days. No invoices, no chasing."</p>
              <div className="who"><img src="https://i.pravatar.cc/80?img=45" alt="" /><div><div className="nm">Maya Rehman</div><div className="rl">Fashion creator · 128K</div></div></div>
            </div>
            <div className="quote reveal d2">
              <span className="badge creator">Creator</span>
              <div className="stars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.8 5.7 21l1.3-6.8-5-4.6 6.8-.8z"/></svg></div>
              <p>"As a mid-size page I used to get ignored by agencies. Here brands invite me directly and the terms are clear every time."</p>
              <div className="who"><img src="https://i.pravatar.cc/80?img=32" alt="" /><div><div className="nm">Noah Klein</div><div className="rl">Fitness creator · 512K</div></div></div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">SIMPLE, HONEST PRICING</p>
            <h2 className="h2">One flat 15%. That's it.</h2>
            <p className="lead">No monthly fees to browse or list. We only earn when a collaboration is completed — so our incentive is your success.</p>
          </div>
          <div className="price-wrap">
            <div className="price-card hero-price reveal">
              <span className="tag">FOR BRANDS</span>
              <div className="big">15%<small> per completed campaign</small></div>
              <p style={{ opacity: '.85' }}>Browse and brief for free. Fund a campaign only when you launch it.</p>
              <div className="math">
                <div className="m"><div className="v">$500</div><div className="k">Campaign budget</div></div>
                <div className="op">−</div>
                <div className="m"><div className="v">$75</div><div className="k">Platform fee</div></div>
                <div className="op">=</div>
                <div className="m"><div className="v">$425</div><div className="k">Creator earns</div></div>
              </div>
              <Link to="/pricing" className="btn btn-white btn-block">See full pricing</Link>
            </div>
            <div className="price-card reveal d1">
              <span className="tag" style={{ color: 'var(--coral-600)' }}>FOR CREATORS</span>
              <div className="big">Free<small> to join &amp; list</small></div>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>List unlimited pages across six platforms</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Keep 85% of every collaboration</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Fast Stripe payouts, typically within 48 hours</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>See your net earnings before you accept</li>
              </ul>
              <Link to="/auth/signup/creator" className="btn btn-accent btn-block">Create your free profile</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">QUESTIONS</p>
            <h2 className="h2">Good to know</h2>
          </div>
          <div className="faq reveal">
            <div className="qa"><button>How does payment protection work?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Brands fund a campaign upfront and the money is held securely. It's only released to the creator once the promotion is published and the proof is verified by the brand or our team — so neither side is exposed.</p></div></div>
            <div className="qa"><button>What does it cost to join?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Creating an account, browsing creators and listing pages is completely free. We charge a single flat 15% commission only when a collaboration is completed. No subscriptions, no hidden fees.</p></div></div>
            <div className="qa"><button>Which platforms are supported?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Instagram, TikTok, YouTube, X, Facebook and LinkedIn. Creators can list multiple pages across any of these in a single profile, and brands can target by platform when they search.</p></div></div>
            <div className="qa"><button>How fast do creators get paid?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Once a promotion is verified, payouts are processed through Stripe and typically arrive within 48 hours. Creators always see the net amount — after the 15% fee — before accepting any deal.</p></div></div>
            <div className="qa"><button>How are creators verified?<span className="q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div className="ans"><p>Every creator profile and listed page is reviewed before it appears in the marketplace. Verified creators carry a badge so brands can shop with confidence.</p></div></div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="cta-band reveal">
            <h2>Ready to connect?</h2>
            <p>Join the marketplace where brands and creators get matched, get to work, and get paid — fairly.</p>
            <div className="hero-cta">
              <Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a brand</Link>
              <Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
