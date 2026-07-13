import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { scrollLandingTop, scrollToLandingHash } from './useLandingMotion';
import { BrandLogo } from './LandingLayout';

export default function LandingFooter() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goTop = () => scrollLandingTop();

  const goSection = (e, hash) => {
    e.preventDefault();
    if (pathname === '/') {
      scrollToLandingHash(hash);
      return;
    }
    navigate({ pathname: '/', hash });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="f-brand">
          <Link to="/" onClick={goTop} className="brand brand-image-only">
            <BrandLogo height={52} />
          </Link>
          <p className="f-about">
            The marketplace that connects brands with vetted creators across six platforms — with payments held safely until the work is done.
          </p>
          <div className="f-soc">
            <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l8-9L3 3h6l4 5z" /></svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8H3.7v12h2.8V8zM5.1 3.5A1.6 1.6 0 1 0 5 6.7a1.6 1.6 0 0 0 .1-3.2zM20.3 20h-2.8v-6.3c0-1.6-.6-2.4-1.8-2.4-1 0-1.6.7-1.8 1.4-.1.2-.1.6-.1.9V20H11s.1-11 0-12h2.8v1.7c.4-.6 1-1.5 2.7-1.5 2 0 3.8 1.3 3.8 4.2V20z" /></svg>
            </a>
          </div>
        </div>
        <div className="f-col">
          <h4>Product</h4>
          <Link to="/how-it-works" onClick={goTop}>How it works</Link>
          <Link to="/pricing" onClick={goTop}>Pricing</Link>
          <Link to={{ pathname: '/', hash: '#brands' }} onClick={(e) => goSection(e, '#brands')}>For brands</Link>
          <Link to={{ pathname: '/', hash: '#creators' }} onClick={(e) => goSection(e, '#creators')}>For creators</Link>
        </div>
        <div className="f-col">
          <h4>Company</h4>
          <Link to="/about" onClick={goTop}>About us</Link>
          <Link to="/contact" onClick={goTop}>Contact</Link>
        </div>
        <div className="f-col">
          <h4>Legal</h4>
          <Link to="/terms" onClick={goTop}>Terms</Link>
          <Link to="/privacy" onClick={goTop}>Privacy</Link>
        </div>
        <div className="f-news">
          <h4>Stay in the loop</h4>
          <input type="email" placeholder="you@email.com" aria-label="Email" />
          <button type="button" className="btn btn-primary">Subscribe</button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {year} {BRAND.name}. All rights reserved.
        </span>
        <span>Built for brands &amp; creators · Payments secured by Stripe</span>
      </div>
    </footer>
  );
}
