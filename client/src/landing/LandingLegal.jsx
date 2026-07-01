import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { PageHero } from './LandingLayout';

export function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL"
        title="Terms of Service"
        lead={`By using ${BRAND.name} you agree to our terms. Campaign funds are held in escrow until collaboration completion.`}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="lead reveal">Full terms will be published here. For questions, contact {BRAND.supportEmail}.</p>
          <Link to="/" className="btn btn-outline reveal" style={{ marginTop: 26 }}>Back to home</Link>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL"
        title="Privacy Policy"
        lead="We protect your data. Payment processing is handled by Stripe. We do not sell personal information."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="lead reveal">Full privacy policy will be published here. For questions, contact {BRAND.supportEmail}.</p>
          <Link to="/" className="btn btn-outline reveal" style={{ marginTop: 26 }}>Back to home</Link>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="page-hero" style={{ paddingBottom: 80 }}>
      <div className="container center">
        <h1 className="display reveal" style={{ color: 'var(--slate-300)' }}>404</h1>
        <p className="lead reveal d1" style={{ marginTop: 16 }}>Page not found</p>
        <Link to="/" className="btn btn-primary reveal d2" style={{ marginTop: 32 }}>Go home</Link>
      </div>
    </section>
  );
}
