import { Link, useLocation } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { BrandLogo } from './LandingLayout';

const links = [
  { to: '/#brands', label: 'For brands' },
  { to: '/#creators', label: 'For creators' },
  { to: '/how-it-works', label: 'How it works', match: '/how-it-works' },
  { to: '/pricing', label: 'Pricing', match: '/pricing' },
  { to: '/about', label: 'About', match: '/about' },
];

function isActive(pathname, link) {
  if (link.match) return pathname === link.match;
  return false;
}

export default function LandingNav() {
  const { pathname } = useLocation();

  return (
    <>
      <header className="nav">
        <div className="container">
          <Link to="/" className="brand">
            <span className="logo"><BrandLogo /></span>
            {BRAND.name}
          </Link>
          <nav className="nav-links">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={isActive(pathname, l) ? 'active' : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link to="/auth/login" className="btn btn-ghost">Log in</Link>
            <Link to="/auth/signup" className="btn btn-primary">Get started</Link>
          </div>
          <button type="button" className="nav-toggle" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <div className="mobile-menu">
        {links.map((l) => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
        <Link to="/auth/login" className="btn btn-outline btn-block">Log in</Link>
        <Link to="/auth/signup" className="btn btn-primary btn-block">Get started</Link>
      </div>
    </>
  );
}
