import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function LandingAbout() {
  return (
    <>
      <section className="about-ref-hero">
        <div className="container">
          <div className="about-ref-hero-grid">
            <div className="about-ref-copy reveal">
              <p className="eyebrow">ABOUT US</p>
              <h1 className="h1">Connecting Businesses and Creators <span>Through Trust</span></h1>
              <p className="lead">{BRAND.name} is building the simplest way for businesses to launch social media campaigns and for creators to earn from the pages they already own.</p>
              <ul className="about-ref-points">
                <li>One platform.</li>
                <li>One transparent process.</li>
                <li>Unlimited opportunities.</li>
              </ul>
            </div>
            <div className="about-ref-visual reveal d1" aria-hidden="true">
              <div className="about-ref-stage">
                <img className="about-ref-main" src="/landing/social/girl.png" alt="" />
                <img className="about-ref-side" src="/landing/social/image9.png" alt="" />
                <div className="about-ref-chip about-ref-chip--top">
                  <strong>$8,420</strong>
                  <span>Campaign Earnings</span>
                </div>
                <div className="about-ref-chip about-ref-chip--mid">
                  <strong>Skincare Brand</strong>
                  <span>Apply now</span>
                </div>
                <div className="about-ref-chip about-ref-chip--bottom">
                  <strong>+24%</strong>
                  <span>Campaign Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission-strip">
        <div className="container">
          <div className="about-mission-card reveal">
            <div className="about-mission-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3v3M3 12h3M18 12h3M12 18v3" /></svg>
            </div>
            <div>
              <p className="eyebrow">OUR MISSION</p>
              <h2 className="h2">Our mission is to make influencer marketing accessible to every business and every creator.</h2>
              <p>Whether you're a local restaurant looking for new customers, or a creator with 2,000 followers, {BRAND.name} gives you the tools to collaborate, grow, and succeed together.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-work">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">HOW MYPLYN WORKS</p>
          </div>
          <div className="about-work-grid">
            <div className="about-work-card reveal">
              <div className="about-work-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              </div>
              <h3>For Businesses</h3>
              <ul>
                <li>Create campaigns in minutes</li>
                <li>Find the right creators</li>
                <li>Track everything in one place</li>
              </ul>
              <Link to="/how-it-works">Learn more</Link>
            </div>
            <div className="about-work-arrow" aria-hidden="true">→</div>
            <div className="about-work-card reveal d1">
              <div className="about-work-ico about-work-ico--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3>For Creators</h3>
              <ul>
                <li>Connect your social media pages</li>
                <li>Receive campaign offers</li>
                <li>Get paid securely</li>
              </ul>
              <Link to="/how-it-works">Learn more</Link>
            </div>
            <div className="about-work-arrow" aria-hidden="true">→</div>
            <div className="about-work-card reveal d2">
              <div className="about-work-ico about-work-ico--blue" aria-hidden="true">
                <img src="/landing/logo.png" alt="" />
              </div>
              <h3>Myplyn Platform</h3>
              <p>We handle matching, payments, communication, and campaign management all in one place.</p>
              <Link to="/how-it-works">See how it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">WHY MYPLYN?</p></div>
          <div className="about-why-grid">
            <article className="about-why-item reveal"><span className="about-why-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" /></svg></span><h4>Fast Onboarding</h4><p>Get started in less than 2 minutes.</p></article>
            <article className="about-why-item reveal d1"><span className="about-why-ico about-why-ico--purple" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span><h4>Secure Payments</h4><p>We protect your payments and personal data.</p></article>
            <article className="about-why-item reveal d2"><span className="about-why-ico about-why-ico--blue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.5 12a3.5 3.5 0 0 1 6.24-2.16A3.5 3.5 0 1 1 12 15.5" /></svg></span><h4>AI-Powered Matching</h4><p>We connect you with the best opportunities.</p></article>
            <article className="about-why-item reveal d3"><span className="about-why-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg></span><h4>Built for Global Growth</h4><p>Designed to support creators and businesses worldwide.</p></article>
          </div>
        </div>
      </section>

      <section className="section about-values" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">OUR VALUES</p></div>
          <div className="about-values-grid">
            <article className="about-value reveal"><span className="about-why-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg></span><h4>Transparency</h4><p>Every campaign is fully transparent.</p></article>
            <article className="about-value reveal d1"><span className="about-why-ico about-why-ico--purple" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6.2-4.35-8.5-7.8C1.7 10.2 3.2 6.5 6.6 6c1.7-.3 3.3.4 4.4 1.7C12.1 6.4 13.7 5.7 15.4 6c3.4.5 4.9 4.2 3.1 7.2C18.2 16.65 12 21 12 21z" /></svg></span><h4>Simplicity</h4><p>No complicated tools, just create, connect, and grow.</p></article>
            <article className="about-value reveal d2"><span className="about-why-ico about-why-ico--blue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg></span><h4>Trust</h4><p>Secure payments and verified users you can rely on.</p></article>
            <article className="about-value reveal d3"><span className="about-why-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></span><h4>Growth</h4><p>We’re here to help businesses and creators grow together.</p></article>
          </div>

          <div className="about-stat-band reveal d1">
            <div><strong>15,000+</strong><span>Creators Connected</span></div>
            <div><strong>2,500+</strong><span>Businesses Registered</span></div>
            <div><strong>8,900+</strong><span>Campaigns Completed</span></div>
            <div><strong>₨12M+</strong><span>Creator Payouts</span></div>
          </div>

          <div className="about-bottom-cta reveal d2">
            <h3>Ready to join Myplyn?</h3>
            <p>Join thousands of creators and businesses already growing together.</p>
            <div className="hero-cta">
              <Link to="/auth/signup/creator" className="btn btn-green">Get Started for Free</Link>
              <Link to="/auth/login" className="btn btn-white">Log In</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
