import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { useAuth } from '../hooks/useAuth';
import { getPostLoginPath } from '../utils/authRedirect';
import { scrollLandingTop, scrollToLandingHash } from './useLandingMotion';

const links = [
  { to: '/', hash: '#creators', label: 'For Creators' },
  { to: '/', hash: '#brands', label: 'For Businesses' },
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
  const { user, logout } = useAuth();

  const handleNavClick = (e, link) => {
    if (link.hash) {
      e.preventDefault();
      if (pathname === '/') {
        scrollToLandingHash(link.hash);
      } else {
        navigate({ pathname: '/', hash: link.hash });
      }
      return;
    }

    if (link.to === '/') {
      e.preventDefault();
      navigate('/');
      requestAnimationFrame(() => scrollLandingTop());
      return;
    }

    scrollLandingTop();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
    scrollLandingTop();
  };

  const dashboardPath = user ? getPostLoginPath(user) : '/auth/login';

  return (
    <>
      <header className="nav">
        <div className="container nav-container">
          <div className="nav-shell">
            <Link
              to="/"
              className="brand"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                requestAnimationFrame(() => scrollLandingTop());
              }}
            >
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
                  to={l.hash ? { pathname: l.to, hash: l.hash } : l.to}
                  onClick={(e) => handleNavClick(e, l)}
                  className={isActive(pathname, l) ? 'active' : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="nav-actions">
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => scrollLandingTop()} className="nav-login">Dashboard</Link>
                  <button type="button" onClick={handleLogout} className="btn btn-outline nav-join">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => scrollLandingTop()} className="nav-login">Log in</Link>
                  <Link to="/auth/signup/creator" onClick={() => scrollLandingTop()} className="btn btn-primary nav-join">Join Now</Link>
                </>
              )}
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
          <Link
            key={`${l.to}-${l.label}`}
            to={l.hash ? { pathname: l.to, hash: l.hash } : l.to}
            onClick={(e) => handleNavClick(e, l)}
          >
            {l.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link to={dashboardPath} onClick={() => scrollLandingTop()} className="btn btn-outline btn-block">Dashboard</Link>
            <button type="button" onClick={handleLogout} className="btn btn-primary btn-block">Log out</button>
          </>
        ) : (
          <>
            <Link to="/auth/login" onClick={() => scrollLandingTop()} className="btn btn-outline btn-block">Log in</Link>
            <Link to="/auth/signup/creator" onClick={() => scrollLandingTop()} className="btn btn-primary btn-block">Join Now</Link>
          </>
        )}
      </div>
    </>
  );
}
