import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function LandingHowItWorks() {
  return (
    <>
      <section className="page-hero">
        <div className="hero-bg"><span className="blob b1"></span><span className="blob b2"></span></div>
        <div className="container">
          <p className="eyebrow reveal">HOW IT WORKS</p>
          <h1 className="h1 reveal d1" style={{ marginTop: '14px' }}>One transparent flow,<br />from match to payout</h1>
          <p className="lead reveal d2">Every collaboration moves through the same clear steps — and both sides can see the status at every stage. No guesswork, no chasing.</p>
        </div>
      </section>


      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="lanes">
            <div className="lane brand-lane reveal">
              <div className="lane-head"><span className="lane-tag">BRANDS</span></div>
              <h3 className="h3">Your journey as an advertiser</h3>
              <ol>
                <li><div><b>Create &amp; fund a campaign</b><span>Add your brief, requirements, target audience and budget. Fund it upfront — the money is held securely until work is approved.</span></div></li>
                <li><div><b>Discover or invite creators</b><span>Search the marketplace by niche, platform, location and price, or post an open brief and let creators apply.</span></div></li>
                <li><div><b>Review &amp; approve</b><span>Compare applicants, check verified stats and reviews, then approve the creators you want with a click.</span></div></li>
                <li><div><b>Share your assets</b><span>Send creative, talking points and links through built-in messaging so creators have everything they need.</span></div></li>
                <li><div><b>Verify the proof</b><span>When the creator posts, you get the live link or screenshot. Approve it — or request changes — in seconds.</span></div></li>
                <li><div><b>Payment released</b><span>On approval, the held funds release to the creator automatically. You keep a full record of every campaign.</span></div></li>
              </ol>
            </div>
            <div className="lane creator-lane reveal d1">
              <div className="lane-head"><span className="lane-tag">CREATORS</span></div>
              <h3 className="h3">Your journey as a creator</h3>
              <ol>
                <li><div><b>List your pages</b><span>Add your platforms, niches, audience size and rates to one free profile. Get verified to stand out.</span></div></li>
                <li><div><b>Get matched or apply</b><span>Receive invitations that fit your niche, or browse open campaigns and apply with a single tap.</span></div></li>
                <li><div><b>Accept the deal</b><span>See the offer and your exact net earnings — after the 15% fee — before you commit. No surprises.</span></div></li>
                <li><div><b>Create &amp; publish</b><span>Use the brand's assets to publish the promotion on your page, on your schedule.</span></div></li>
                <li><div><b>Submit proof</b><span>Drop in the live link or a screenshot. The brand or our team verifies it quickly.</span></div></li>
                <li><div><b>Get paid fast</b><span>Once verified, your payout is processed through Stripe — typically in your account within 48 hours.</span></div></li>
              </ol>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-soft">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">THE FULL WORKFLOW</p>
            <h2 className="h2">Eleven steps, one shared status</h2>
            <p className="lead">Behind the scenes, every collaboration follows the same lifecycle — visible to brand, creator and our team alike.</p>
          </div>
          <div className="flowstrip reveal">
            <div className="fs"><span className="n">1</span>List pages</div>
            <div className="fs"><span className="n">2</span>Create &amp; fund</div>
            <div className="fs"><span className="n">3</span>Discover</div>
            <div className="fs"><span className="n">4</span>Request / apply</div>
            <div className="fs"><span className="n">5</span>Accept</div>
            <div className="fs"><span className="n">6</span>Share assets</div>
            <div className="fs"><span className="n">7</span>Publish</div>
            <div className="fs"><span className="n">8</span>Submit proof</div>
            <div className="fs"><span className="n">9</span>Verify</div>
            <div className="fs"><span className="n">10</span>Release payment</div>
            <div className="fs"><span className="n">11</span>15% commission</div>
          </div>
        </div>
      </section>


      <section className="section audience">
        <div className="container">
          <div className="a-copy reveal">
            <p className="eyebrow">SECURE PAYMENTS</p>
            <h2 className="h2">Money is held until the work is done</h2>
            <p className="lead" style={{ marginTop: '18px' }}>When a brand funds a campaign, the budget is held safely by the platform — not paid out yet, not pocketed. It's released to the creator only after the promotion is published and verified.</p>
            <ul className="a-list">
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Brands are protected</b><span>You never pay for a post that doesn't go live. Funds only release on your approval.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Creators are guaranteed</b><span>The money is already secured before you start, so you know the deal is real.</span></div></li>
              <li><span className="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div><b>Powered by Stripe</b><span>Card payments and creator payouts run on Stripe Connect — secure, compliant and fast.</span></div></li>
            </ul>
          </div>
          <div className="a-visual reveal d2">
            <div className="mock">
              <div className="mock-top"><span className="dot r"></span><span className="dot y"></span><span className="dot g"></span><span className="tt">Collaboration · status</span></div>
              <div className="mock-body">
                <div className="tbl">
                  <div className="tr"><span className="pill ok" style={{ marginLeft: '0' }}>✓</span><div><div className="nm">Campaign funded</div><div className="sub">$1,500 held securely</div></div><span className="pill ok">Done</span></div>
                  <div className="tr"><span className="pill ok" style={{ marginLeft: '0' }}>✓</span><div><div className="nm">Creator accepted</div><div className="sub">@maya.styles · net $1,275</div></div><span className="pill ok">Done</span></div>
                  <div className="tr"><span className="pill ok" style={{ marginLeft: '0' }}>✓</span><div><div className="nm">Post published</div><div className="sub">Proof submitted</div></div><span className="pill ok">Done</span></div>
                  <div className="tr" style={{ borderColor: 'var(--indigo-200)', background: 'var(--indigo-50)' }}><span className="pill live" style={{ marginLeft: '0' }}>●</span><div><div className="nm">Awaiting verification</div><div className="sub">Approve to release payment</div></div><span className="pill pend">Now</span></div>
                  <div className="tr" style={{ opacity: '.55' }}><span className="pill" style={{ marginLeft: '0', background: 'var(--slate-100)', color: 'var(--slate-400)' }}>$</span><div><div className="nm">Payout released</div><div className="sub">Stripe · within 48h</div></div><span className="pill" style={{ background: 'var(--slate-100)', color: 'var(--slate-400)' }}>Next</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container"><div className="cta-band reveal">
          <h2>Start your first collaboration today</h2>
          <p>It takes minutes to post a campaign or list your pages. Pay — or get paid — only when the work is done.</p>
          <div className="hero-cta"><Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a brand</Link><Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link></div>
        </div></div>
      </section>
    </>
  );
}
