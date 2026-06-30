import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { BRAND } from '../../config/brand';

export default function HomePage() {
  return (
    <section className="max-w-6xl mx-auto cc-animate-fade" style={{ padding: '80px 30px', textAlign: 'center' }}>
      <h1 className="font-extrabold leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
        Connect brands with<br />
        <span style={{ color: 'var(--accent)' }}>creators who deliver</span>
      </h1>
      <p className="mx-auto" style={{ fontSize: 18, color: 'var(--text-2)', marginTop: 24, maxWidth: 560 }}>
        {BRAND.name} is the influencer marketplace where advertisers fund campaigns and creators get paid — with full transparency.
      </p>
      <div className="flex gap-3 justify-center flex-wrap" style={{ marginTop: 40 }}>
        <Link to="/auth/signup" className="btn-primary" style={{ height: 44, padding: '0 24px', fontSize: 15 }}>Get started</Link>
        <Link to="/how-it-works" className="btn-ghost" style={{ height: 44, padding: '0 24px', fontSize: 15 }}>How it works</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-left" style={{ marginTop: 80 }}>
        {[
          { title: 'For Advertisers', desc: 'Create campaigns, find creators, fund collaborations, verify proofs, release payments.', link: '/auth/signup', icon: 'campaign' },
          { title: 'For Creators', desc: 'List your pages, discover campaigns, submit proofs, and withdraw earnings.', link: '/auth/signup', icon: 'groups' },
          { title: 'Secure Payments', desc: 'Funds held in escrow. 15% platform fee on completion. Stripe-powered.', link: '/pricing', icon: 'lock' },
        ].map((c) => (
          <div key={c.title} className="card">
            <Icon name={c.icon} size={24} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <h3 className="section-title">{c.title}</h3>
            <p style={{ color: 'var(--text-2)', marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{c.desc}</p>
            <Link to={c.link} className="inline-flex items-center gap-1 font-semibold" style={{ color: 'var(--accent-text)', marginTop: 16, fontSize: 13 }}>
              Learn more <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StaticPage({ title, children }) {
  return (
    <div className="max-w-3xl mx-auto cc-animate-fade" style={{ padding: '64px 30px' }}>
      <h1 className="page-title">{title}</h1>
      <div style={{ color: 'var(--text-2)', marginTop: 24, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export function HowItWorksPage() {
  return (
    <StaticPage title="How It Works">
      <p>{BRAND.name} connects advertisers with social media creators through a structured 11-step workflow:</p>
      <ol className="list-decimal list-inside space-y-2" style={{ marginTop: 16 }}>
        <li>Creators register and list their social pages</li>
        <li>Advertisers create and fund campaigns</li>
        <li>Creators discover campaigns or receive invitations</li>
        <li>Applications and collaboration requests are reviewed</li>
        <li>Creators accept and receive promotional content</li>
        <li>Creators publish and submit proof</li>
        <li>Advertisers verify and release payment</li>
        <li>Platform retains 15% commission</li>
      </ol>
    </StaticPage>
  );
}

export function PricingPage() {
  return (
    <StaticPage title="Pricing">
      <p>{BRAND.name} charges a <strong>15% platform fee</strong> on each completed collaboration. No monthly subscriptions.</p>
      <div className="grid md:grid-cols-2 gap-4" style={{ marginTop: 32 }}>
        <div className="card" style={{ borderColor: 'var(--accent)', borderWidth: 2 }}>
          <h3 className="section-title">Advertisers</h3>
          <p className="font-extrabold" style={{ fontSize: 28, marginTop: 8 }}>Free to join</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 8 }}>Pay only for completed collaborations + 15% fee</p>
        </div>
        <div className="card">
          <h3 className="section-title">Creators</h3>
          <p className="font-extrabold" style={{ fontSize: 28, marginTop: 8 }}>Free to join</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 8 }}>Receive 85% of agreed collaboration amount</p>
        </div>
      </div>
    </StaticPage>
  );
}

export function AboutPage() {
  return (
    <StaticPage title="About Us">
      <p>{BRAND.name} is building the most transparent influencer marketplace — where every collaboration has clear status, proof, and payment.</p>
    </StaticPage>
  );
}

export function ContactPage() {
  return (
    <StaticPage title="Contact Us">
      <p>Email us at {BRAND.supportEmail}</p>
      <form className="space-y-4" style={{ marginTop: 24 }} onSubmit={(e) => e.preventDefault()}>
        <div><label className="label">Name</label><input className="input" /></div>
        <div><label className="label">Email</label><input type="email" className="input" /></div>
        <div><label className="label">Message</label><textarea className="input" rows={4} /></div>
        <button type="submit" className="btn-primary">Send message</button>
      </form>
    </StaticPage>
  );
}

export function TermsPage() {
  return <StaticPage title="Terms of Service"><p>By using {BRAND.name} you agree to our terms. Campaign funds are held in escrow until collaboration completion.</p></StaticPage>;
}

export function PrivacyPage() {
  return <StaticPage title="Privacy Policy"><p>We protect your data. Payment processing is handled by Stripe. We do not sell personal information.</p></StaticPage>;
}

export function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto text-center cc-animate-fade" style={{ padding: '120px 30px' }}>
      <h1 className="font-extrabold" style={{ fontSize: 96, color: 'var(--border-2)' }}>404</h1>
      <p style={{ fontSize: 20, color: 'var(--text-2)', marginTop: 16 }}>Page not found</p>
      <Link to="/" className="btn-primary inline-flex" style={{ marginTop: 32 }}>Go home</Link>
    </div>
  );
}
