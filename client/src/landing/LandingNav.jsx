import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../config/brand';

const links = [
  { to: '/', label: 'For Creators' },
  { to: '/', label: 'For Businesses' },
  { to: '/how-it-works', label: 'How it Works', match: '/how-it-works' },
  { to: '/pricing', label: 'Pricing', match: '/pricing' },
  { to: '/about', label: 'About', match: '/about' },
];

function isActive(pathname, link) {
  if (link.match) return pathname === link.match;
  return false;
}

export default function LandingNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const goTop = () => {
    const lenis = window.__landingLenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  const goHomeTop = (e) => {
    e.preventDefault();
    navigate('/');
    requestAnimationFrame(goTop);
  };

  return (
    <>
      <header className="nav">
        <div className="container nav-container">
          <div className="nav-shell">
            <Link to="/" className="brand" onClick={goTop}>
              <img src={BRAND.logoSrc} alt="" className="brand-mark" width={38} height={38} />
              <span className="brand-wordmark" aria-hidden="true">
                <span className="brand-my">MY</span>
                <span className="brand-plyn">PLYN</span>
              </span>
              <span className="sr-only">{BRAND.logoAlt}</span>
            </Link>
            <nav className="nav-links">
              {links.map((l) => (
                <Link
                  key={`${l.to}-${l.label}`}
                  to={l.to}
                  onClick={l.to === '/' ? goHomeTop : goTop}
                  className={isActive(pathname, l) ? 'active' : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="nav-actions">
              <Link to="/auth/login" onClick={goTop} className="nav-login">Log in</Link>
              <Link to="/auth/signup/creator" onClick={goTop} className="btn btn-primary nav-join">Join Now</Link>
            </div>
            <button type="button" className="nav-toggle" aria-label="Open menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="mobile-menu">
        {links.map((l) => (
          <Link key={`${l.to}-${l.label}`} to={l.to} onClick={l.to === '/' ? goHomeTop : goTop}>{l.label}</Link>
        ))}
        <Link to="/auth/login" onClick={goTop} className="btn btn-outline btn-block">Log in</Link>
        <Link to="/auth/signup/creator" onClick={goTop} className="btn btn-primary btn-block">Join Now</Link>
      </div>
    </>
  );
}
