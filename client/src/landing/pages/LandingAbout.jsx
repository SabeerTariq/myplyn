import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function LandingAbout() {
  return (
    <>
      <section className="page-hero">
        <div className="hero-bg"><span className="blob b1"></span><span className="blob b2"></span></div>
        <div className="container">
          <p className="eyebrow reveal">OUR STORY</p>
          <h1 className="h1 reveal d1" style={{ marginTop: '14px' }}>Creator marketing,<br />made fair for both sides</h1>
          <p className="lead reveal d2">We started {BRAND.name} because influencer deals were broken in the same two ways for everyone: brands couldn't trust what they were paying for, and creators couldn't trust they'd get paid. So we built a marketplace where both are guaranteed.</p>
        </div>
      </section>


      <section className="section audience" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="a-copy reveal">
            <p className="eyebrow">THE MISSION</p>
            <h2 className="h2">Level the playing field</h2>
            <p className="lead" style={{ marginTop: '18px' }}>Big agencies and huge influencers always had the tools. Everyone else — small brands, growing creators, mid-size pages — got left with DMs, spreadsheets and broken promises.</p>
            <p style={{ marginTop: '16px', color: 'var(--slate-500)' }}>{BRAND.name} puts the same trust, structure and payment protection in everyone's hands. Discovery is open, pricing is transparent, and money is held safely until the work is done. No gatekeepers, no guesswork.</p>
            <Link to="/how-it-works" className="btn btn-outline" style={{ marginTop: '26px' }}>See how it works
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </div>
          <div className="a-visual reveal d2">
            <div className="stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="stat" style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '26px' }}><div className="num"><span data-count="2400" data-suffix="+"></span></div><div className="lbl">Creators onboarded</div></div>
              <div className="stat" style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '26px' }}><div className="num">$<span data-count="1.2" data-dec="1" data-suffix="M+"></span></div><div className="lbl">Paid to creators</div></div>
              <div className="stat" style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '26px' }}><div className="num"><span data-count="6"></span></div><div className="lbl">Platforms supported</div></div>
              <div className="stat" style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '26px' }}><div className="num"><span data-count="48"></span>h</div><div className="lbl">Typical payout time</div></div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">WHAT WE BELIEVE</p><h2 className="h2">The principles behind the product</h2></div>
          <div className="values">
            <div className="card reveal">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
              <h3>Trust by default</h3><p>Funds held until work is verified, vetted creators, and clear records. Trust shouldn't be a leap of faith — it should be built in.</p>
            </div>
            <div className="card reveal d1">
              <div className="ico coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20"/></svg></div>
              <h3>Radical transparency</h3><p>One flat fee, net earnings shown upfront, no hidden cuts. Everyone sees exactly where every dollar goes.</p>
            </div>
            <div className="card reveal d2">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="4"/><path d="M17 11l2 2 4-4"/><path d="M2 21a7 7 0 0 1 13 0"/></svg></div>
              <h3>Built for both sides</h3><p>We design every feature for brands and creators at once. A win for one side should never be a loss for the other.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">THE TEAM</p><h2 className="h2">A small team with a clear focus</h2>
            <p className="lead">Marketers, engineers and creators who've lived both sides of the influencer equation.</p></div>
          <div className="team">
            <div className="member reveal"><img src="https://i.pravatar.cc/360?img=13" alt="Portrait" /><div className="nm">Haris Khan</div><div className="rl">Founder &amp; CEO</div></div>
            <div className="member reveal d1"><img src="https://i.pravatar.cc/360?img=32" alt="Portrait" /><div className="nm">Noah Bennett</div><div className="rl">Head of Product</div></div>
            <div className="member reveal d2"><img src="https://i.pravatar.cc/360?img=45" alt="Portrait" /><div className="nm">Maya Rahman</div><div className="rl">Creator Partnerships</div></div>
            <div className="member reveal d3"><img src="https://i.pravatar.cc/360?img=51" alt="Portrait" /><div className="nm">Daniel Brooks</div><div className="rl">Brand Success</div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container"><div className="cta-band reveal">
          <h2>Come build the fair side of creator marketing</h2>
          <p>Whether you're a brand or a creator, there's a place for you in the circle.</p>
          <div className="hero-cta"><Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a brand</Link><Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link></div>
        </div></div>
      </section>
    </>
  );
}
