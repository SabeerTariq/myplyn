import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import Icon from '../components/Icon';
import {
  GoogleBrandLogo,
  FacebookBrandLogo,
  AppleBrandLogo,
  InstagramBrandLogo,
  TikTokBrandLogo,
  YouTubeBrandLogo,
  XBrandLogo,
  LinkedInBrandLogo,
} from '../landing/SocialBrandIcons';
import '../styles/auth.css';

function AuthSocialButton({ label, className = '', onClick, icon }) {
  return (
    <button
      type="button"
      className={`auth-social-btn ${className}`.trim()}
      onClick={onClick}
    >
      <span className="auth-social-icon" aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

const FEATURES = [
  { icon: 'verified_user', title: 'Secure & Trusted', text: 'Your data and earnings are protected at every step.' },
  { icon: 'bolt', title: 'Smart Connections', text: 'Get matched with the right brands or creators instantly.' },
  { icon: 'check_circle', title: 'Real Results', text: 'Track performance and payouts in one place.' },
];

function DashboardMockup() {
  return (
    <div className="auth-mockup">
      <span className="auth-float-icon auth-float-icon--chart" aria-hidden="true">📈</span>
      <span className="auth-float-icon auth-float-icon--people" aria-hidden="true">👥</span>
      <span className="auth-float-icon auth-float-icon--money" aria-hidden="true">💰</span>
      <div className="auth-mockup-card">
        <div className="auth-mockup-top">
          <span className="auth-mockup-dot" />
          <span className="auth-mockup-dot" />
          <span className="auth-mockup-dot" />
        </div>
        <div className="auth-mockup-body">
          <div className="auth-mockup-sidebar">
            <span className="auth-mockup-nav active" />
            <span className="auth-mockup-nav" />
            <span className="auth-mockup-nav" />
            <span className="auth-mockup-nav" />
          </div>
          <div className="auth-mockup-chart">
            <h3>Performance Overview</h3>
            <svg viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="authChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#33C15E" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#33C15E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 58 C24 52 40 36 64 40 C88 44 104 18 128 24 C152 30 176 10 240 12 L240 72 L0 72 Z" fill="url(#authChartFill)" />
              <path d="M0 58 C24 52 40 36 64 40 C88 44 104 18 128 24 C152 30 176 10 240 12" fill="none" stroke="#1EA24C" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingFeatures() {
  return (
    <div className="auth-features">
      {FEATURES.map((item) => (
        <div key={item.title} className="auth-feature">
          <span className="auth-feature-icon"><Icon name={item.icon} size={18} /></span>
          <div>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const MARKETING = {
  'creator-signup': {
    title: <>Start earning from your <em>social media pages</em></>,
    lead: 'Connect your pages, receive brand offers, and get paid for the audience you already built.',
  },
  'advertiser-signup': {
    title: <>Grow your business with <em>social media creators</em></>,
    lead: 'Create campaigns, discover creators, and launch promotions that actually go live.',
  },
  'creator-login': {
    title: <>Welcome back, <em>creator!</em></>,
    lead: 'Log in to manage your pages, review brand offers, and track your earnings.',
  },
  'advertiser-login': {
    title: <>Welcome back, <em>partner!</em></>,
    lead: 'Log in to manage campaigns, discover creators, and grow your business.',
  },
  login: {
    title: <>Welcome <em>back!</em></>,
    lead: 'Log in to your account and continue growing with Myplyn.',
  },
  signup: {
    title: <>Join the <em>creator economy</em></>,
    lead: 'Whether you run campaigns or create content, Myplyn connects brands and creators in one place.',
  },
};

export function AuthMarketing({ variant = 'login' }) {
  const content = MARKETING[variant] || MARKETING.login;

  return (
    <div className="auth-marketing">
      <h1>{content.title}</h1>
      <p className="auth-marketing-lead">{content.lead}</p>
      <DashboardMockup />
      <MarketingFeatures />
    </div>
  );
}

export function AuthPageShell({ variant = 'login', children }) {
  const showMarketing = variant.includes('login');

  return (
    <div className="auth-page cc-animate-fade">
      <Link to="/" className="auth-page-logo">
        <BrandMark size={48} />
      </Link>

      <div className={`auth-shell${showMarketing ? '' : ' auth-shell--solo'}`}>
        {showMarketing && <AuthMarketing variant={variant} />}
        <div className="auth-form-panel">{children}</div>
      </div>

      <footer className="auth-page-footer">
        <p>
          By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
        <p>© {new Date().getFullYear()} Myplyn. All rights reserved.</p>
      </footer>
    </div>
  );
}

export function AuthSocialButtons({ onSignup }) {
  const social = [
    { label: 'Continue with Google', icon: <GoogleBrandLogo /> },
    { label: 'Continue with Facebook', icon: <FacebookBrandLogo /> },
    { label: 'Continue with Apple', className: 'auth-social-btn--apple', icon: <AppleBrandLogo /> },
    { label: 'Continue with Email', icon: <Icon name="mail" size={20} /> },
  ];

  return (
    <div className="auth-social-stack">
      {social.map((item) => (
        <AuthSocialButton
          key={item.label}
          label={item.label}
          className={item.className}
          onClick={onSignup}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export function CreatorSocialButtons({ onSignup }) {
  const items = [
    { label: 'Continue with Facebook', icon: <FacebookBrandLogo /> },
    { label: 'Continue with Instagram', icon: <InstagramBrandLogo /> },
    { label: 'Continue with TikTok', icon: <TikTokBrandLogo /> },
    { label: 'Continue with YouTube', icon: <YouTubeBrandLogo /> },
    { label: 'Continue with X', icon: <XBrandLogo /> },
    { label: 'Continue with LinkedIn', icon: <LinkedInBrandLogo /> },
    { label: 'Continue with Email', icon: <Icon name="mail" size={20} /> },
  ];

  return (
    <div className="auth-social-stack">
      {items.map((item) => (
        <AuthSocialButton
          key={item.label}
          label={item.label}
          onClick={onSignup}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export function AuthDivider() {
  return <div className="auth-divider">or</div>;
}

export default AuthPageShell;
