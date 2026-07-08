import { Link } from 'react-router-dom';

const businessSteps = [
  {
    title: 'Create your profile',
    text: 'Set up your brand and link your social accounts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Launch campaigns',
    text: 'Create briefs, target creators and set your budget.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    title: 'Invite or accept creators',
    text: 'Choose from offers or invite specific creators.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Send materials',
    text: 'Share assets and messaging via chat.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Approve posts',
    text: 'Review before they go live or request edits.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Release payment',
    text: 'Funds released automatically on approval.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const creatorSteps = [
  {
    title: 'Register with your email',
    text: 'Sign up and link your social pages.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    title: 'Complete your profile',
    text: 'Add details about your niche and audience.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Find or get campaign offers',
    text: 'Browse campaigns or receive invitations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: 'Publish content',
    text: 'Use brand materials to post on your pages.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: 'Submit proof',
    text: 'Upload your live link or screenshot.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Withdraw your earnings',
    text: 'Paid directly after verification.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

function JourneyCard({ title, headerIcon, steps, className, revealClass }) {
  return (
    <article className={`hiw-ref-card ${className} reveal ${revealClass}`.trim()}>
      <div className="hiw-ref-card-head">
        <span className="hiw-ref-card-ico" aria-hidden="true">{headerIcon}</span>
        <h2 className="h3">{title}</h2>
      </div>
      <ol className="hiw-ref-steps">
        {steps.map((step, index) => (
          <li key={step.title} className="hiw-ref-step">
            <span className="hiw-ref-step-num">{index + 1}</span>
            <span className="hiw-ref-step-icon" aria-hidden="true">{step.icon}</span>
            <div className="hiw-ref-step-copy">
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function LandingHowItWorks() {
  return (
    <>
      <section className="hiw-ref-hero">
        <div className="container">
          <p className="eyebrow reveal">HOW IT WORKS</p>
          <h1 className="h1 reveal d1">
            One transparent flow,
            <br />
            from match to payout
          </h1>
          <p className="lead reveal d2">
            A clear, step-by-step process designed to make your workflow seamless and transparent.
          </p>
        </div>
      </section>

      <section className="hiw-ref-journeys">
        <div className="container">
          <div className="hiw-ref-grid">
            <JourneyCard
              title="Your journey as a business"
              className="hiw-ref-card--business"
              revealClass=""
              headerIcon={(
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              )}
              steps={businessSteps}
            />
            <JourneyCard
              title="Your journey as a creator"
              className="hiw-ref-card--creator"
              revealClass="d1"
              headerIcon={(
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
              steps={creatorSteps}
            />
          </div>
        </div>
      </section>

      <section className="hiw-ref-cta">
        <div className="container">
          <div className="hiw-ref-cta-band reveal">
            <span className="hiw-ref-cta-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <div className="hiw-ref-cta-copy">
              <h3>Simple workflow. Clear steps. Secure payouts.</h3>
              <p>Built for trust. Designed for speed.</p>
            </div>
            <Link to="/auth/signup/creator" className="btn btn-green hiw-ref-cta-btn">
              Join as a Creator →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
