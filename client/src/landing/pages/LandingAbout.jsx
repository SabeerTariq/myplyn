import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import Modal from '../../components/Modal';

const topicDetails = {
  business: {
    title: 'How Myplyn works for businesses',
    paragraphs: [
      'Businesses create a campaign brief, choose audience locations, platforms, niches, deliverables, dates, and budget.',
      'They can discover verified creator pages, review audience and performance details, invite suitable creators, or receive applications.',
      'Campaign funds are secured before work begins. Content, feedback, proof of publication, approvals, and payment are managed in one collaboration workspace.',
    ],
  },
  creator: {
    title: 'How Myplyn works for creators',
    paragraphs: [
      'Creators build a profile and list their social pages, niches, audience location, reach, followers, and engagement.',
      'After page review, creators can browse suitable campaigns, submit proposals, or accept invitations from businesses.',
      'Creators publish approved content, submit proof, and withdraw their earnings after the business verifies the completed work.',
    ],
  },
  platform: {
    title: 'How the Myplyn platform works',
    paragraphs: [
      'Myplyn brings creator discovery, campaign matching, proposals, collaboration, messaging, content review, and payments into one platform.',
      'Matching tools help businesses and creators find relevant opportunities using platform, niche, location, audience, and campaign requirements.',
      'A structured approval flow keeps both sides informed from the first invitation through publication, verification, and payout.',
    ],
  },
};

export default function LandingAbout() {
  const [openTopic, setOpenTopic] = useState(null);
  const selectedTopic = openTopic ? topicDetails[openTopic] : null;

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
                <span className="about-ref-blob about-ref-blob--green" />
                <span className="about-ref-blob about-ref-blob--purple" />
                <svg className="about-ref-connectors" viewBox="0 0 520 520" fill="none" aria-hidden="true">
                  <path d="M48 250 Q 120 220 200 180" stroke="rgba(124,58,237,.35)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
                  <path d="M70 120 Q 100 150 140 170" stroke="rgba(0,184,107,.35)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
                  <path d="M250 170 Q 300 140 360 120" stroke="rgba(0,184,107,.3)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
                  <path d="M430 400 Q 460 340 400 280" stroke="rgba(124,58,237,.3)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
                </svg>

                <img className="about-ref-hero-img" src="/landing/social/about-hero.png" alt="" />

                <span className="about-ref-icon about-ref-icon--dollar" aria-hidden="true">$</span>
                <span className="about-ref-icon about-ref-icon--target" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <span className="about-ref-icon about-ref-icon--people" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <span className="about-ref-icon about-ref-icon--megaphone" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 11 18-5v12L3 14v-3z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </span>

                <div className="about-ref-card about-ref-card--earnings">
                  <span className="about-ref-card-label">Campaign Earnings</span>
                  <div className="about-ref-card-row">
                    <strong className="about-ref-card-amt">$8,420</strong>
                    <span className="about-ref-card-pill">+22.5%</span>
                  </div>
                  <svg className="about-ref-sparkline" viewBox="0 0 80 32" aria-hidden="true">
                    <path d="M0 24 L12 20 L24 22 L36 14 L48 16 L60 8 L72 10 L80 4" fill="none" stroke="#00B86B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="about-ref-card about-ref-card--campaign">
                  <span className="about-ref-card-label">New Campaign</span>
                  <strong className="about-ref-card-brand">Skincare Brand</strong>
                  <div className="about-ref-card-footer">
                    <div className="about-ref-card-budget">
                      <span>Budget</span>
                      <strong>$5,000</strong>
                    </div>
                    <button type="button" className="about-ref-card-btn">Apply Now</button>
                  </div>
                </div>

                <div className="about-ref-card about-ref-card--performance">
                  <span className="about-ref-card-label">Campaign Performance</span>
                  <strong className="about-ref-card-pct">+24%</strong>
                  <span className="about-ref-card-label">Engagement</span>
                  <svg className="about-ref-sparkline" viewBox="0 0 80 32" aria-hidden="true">
                    <path d="M0 24 L12 20 L24 22 L36 14 L48 16 L60 8 L72 10 L80 4" fill="none" stroke="#00B86B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission-strip">
        <div className="container">
          <div className="about-mission-card reveal">
            <img
              className="about-mission-art about-mission-art--left"
              src="/landing/social/target_arrow_icon.svg"
              alt=""
              aria-hidden="true"
            />
            <div className="about-mission-copy">
              <p className="eyebrow">OUR MISSION</p>
              <h2 className="h2">Our mission is to make influencer marketing accessible to every business and every creator.</h2>
              <p>Whether you&apos;re a local restaurant looking for new customers, or a creator with 2,000 followers, {BRAND.name} gives you the tools to collaborate, grow, and succeed together.</p>
            </div>
            <img
              className="about-mission-art about-mission-art--right"
              src="/landing/social/rocket_icon_exact_style.svg"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="section about-work">
        <div className="container">
          <div className="section-head center reveal">
            <p className="eyebrow">HOW MYPLYN WORKS</p>
          </div>
          <div className="about-work-grid">
            <div className="about-work-card about-work-card--business reveal">
              <div className="about-work-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              </div>
              <h3>For Businesses</h3>
              <ul>
                <li>Create campaigns in minutes</li>
                <li>Find the right creators</li>
                <li>Track every result</li>
              </ul>
              <button type="button" className="about-work-link" onClick={() => setOpenTopic('business')}>
                Read more →
              </button>
            </div>
            <div className="about-work-arrow" aria-hidden="true">→</div>
            <div className="about-work-card about-work-card--creator reveal d1">
              <div className="about-work-ico about-work-ico--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3>For Creators</h3>
              <ul>
                <li>Connect your social media pages</li>
                <li>Receive campaign offers</li>
                <li>Get paid securely</li>
              </ul>
              <button type="button" className="about-work-link" onClick={() => setOpenTopic('creator')}>
                Read more →
              </button>
            </div>
            <div className="about-work-arrow" aria-hidden="true">→</div>
            <div className="about-work-card about-work-card--platform reveal d2">
              <div className="about-work-ico about-work-ico--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="800" fontFamily="var(--font-display), system-ui, sans-serif">M</text>
                </svg>
              </div>
              <h3>Myplyn Platform</h3>
              <p>We handle matching, payments, communication, and campaign management—all in one place.</p>
              <button type="button" className="about-work-link" onClick={() => setOpenTopic('platform')}>
                Read more →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-why">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">WHY MYPLYN?</p></div>
          <div className="about-why-band reveal">
            <article className="about-why-item">
              <span className="about-why-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" /></svg>
              </span>
              <h4>Fast Onboarding</h4>
              <p>Get started in less than 2 minutes.</p>
            </article>
            <article className="about-why-item">
              <span className="about-why-ico about-why-ico--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <rect x="10" y="11" width="4" height="5" rx="1" />
                  <path d="M12 11V9a2 2 0 0 1 4 0v2" />
                </svg>
              </span>
              <h4>Secure Payments</h4>
              <p>We protect your payments and personal data.</p>
            </article>
            <article className="about-why-item">
              <span className="about-why-ico about-why-ico--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
                </svg>
              </span>
              <h4>AI-Powered Matching</h4>
              <p>We connect you with the best opportunities.</p>
            </article>
            <article className="about-why-item">
              <span className="about-why-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
              </span>
              <h4>Built for Growth in the USA</h4>
              <p>Designed to support creators and businesses across the United States.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section about-values">
        <div className="container">
          <div className="section-head center reveal"><p className="eyebrow">OUR VALUES</p></div>
          <div className="about-values-band reveal">
            <article className="about-value">
              <span className="about-value-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <div className="about-value-copy">
                <h4>Transparency</h4>
                <p>Every campaign is fully transparent.</p>
              </div>
            </article>
            <article className="about-value">
              <span className="about-value-ico about-value-ico--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-6.2-4.35-8.5-7.8C1.7 10.2 3.2 6.5 6.6 6c1.7-.3 3.3.4 4.4 1.7C12.1 6.4 13.7 5.7 15.4 6c3.4.5 4.9 4.2 3.1 7.2C18.2 16.65 12 21 12 21z" />
                </svg>
              </span>
              <div className="about-value-copy">
                <h4>Simplicity</h4>
                <p>No complicated tools. Just create, connect, and grow.</p>
              </div>
            </article>
            <article className="about-value">
              <span className="about-value-ico about-value-ico--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div className="about-value-copy">
                <h4>Trust</h4>
                <p>Secure payments and verified users you can rely on.</p>
              </div>
            </article>
            <article className="about-value">
              <span className="about-value-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16V10" />
                  <path d="M12 16V6" />
                  <path d="M17 16v-4" />
                  <path d="M17 12l2-2" />
                  <path d="M17 12h2" />
                </svg>
              </span>
              <div className="about-value-copy">
                <h4>Growth</h4>
                <p>We&apos;re here to help businesses and creators grow together.</p>
              </div>
            </article>
          </div>

          <div className="about-stat-band reveal d1">
            <div className="about-stat-item">
              <span className="about-stat-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <div className="about-stat-copy">
                <strong>15,000+</strong>
                <span>Creators Connected</span>
              </div>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-ico about-stat-ico--purple" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                  <path d="M3 9l2.5-4h13L21 9" />
                  <path d="M12 9v13" />
                </svg>
              </span>
              <div className="about-stat-copy">
                <strong>2,500+</strong>
                <span>Businesses Registered</span>
              </div>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-ico about-stat-ico--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c4-2 7-6 9-11 2 5 5 9 9 11" />
                  <path d="M12 15V5" />
                  <path d="M9 19h6" />
                </svg>
              </span>
              <div className="about-stat-copy">
                <strong>8,900+</strong>
                <span>Campaigns Completed</span>
              </div>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8" />
                  <path d="M9.5 10.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2c0 2-2.5 2-2.5 4" />
                </svg>
              </span>
              <div className="about-stat-copy">
                <strong>₨12M+</strong>
                <span>Creator Payouts</span>
              </div>
            </div>
            <p className="about-stat-foot">Numbers are growing every day.</p>
          </div>

          <div className="about-bottom-cta reveal d2">
            <img
              className="about-bottom-cta-art about-bottom-cta-art--left"
              src="/landing/social/paper_plane_dotted_svg.svg"
              alt=""
              aria-hidden="true"
            />
            <div className="about-bottom-cta-copy">
              <h3>Ready to join Myplyn?</h3>
              <p>Join thousands of creators and businesses already growing together.</p>
              <div className="hero-cta">
                <Link to="/auth/signup" className="btn btn-green">Get Started for Free</Link>
                <Link to="/auth/login" className="btn btn-white">Log In</Link>
              </div>
            </div>
            <img
              className="about-bottom-cta-art about-bottom-cta-art--right"
              src="/landing/social/star_dotted_path_svg.svg"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <Modal
        open={!!selectedTopic}
        onClose={() => setOpenTopic(null)}
        title={selectedTopic?.title || ''}
        size="md"
      >
        <div className="about-topic-details">
          {selectedTopic?.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link to="/how-it-works" className="btn btn-primary" onClick={() => setOpenTopic(null)}>
            View the complete process
          </Link>
        </div>
      </Modal>
    </>
  );
}
