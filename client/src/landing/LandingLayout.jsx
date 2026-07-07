import { Link, Outlet } from 'react-router-dom';
import { BRAND } from '../config/brand';
import '../styles/landing.css';
import {
  useLandingMotion, useNavScroll, useMobileMenu, useFaqAccordion, useHeroToggle,
} from './useLandingMotion';
import LandingNav from './LandingNav';
import LandingFooter from './LandingFooter';

export default function LandingLayout() {
  useLandingMotion();
  useNavScroll();
  useMobileMenu();
  useFaqAccordion();
  useHeroToggle();

  return (
    <div className="landing-site">
      <LandingNav />
      <Outlet />
      <LandingFooter />
    </div>
  );
}

export function LandingCta({ title, text }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band reveal">
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="hero-cta">
            <Link to="/auth/signup/advertiser" className="btn btn-white btn-lg">Start as a brand</Link>
            <Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead }) {
  return (
    <section className="page-hero">
      <div className="hero-bg"><span className="blob b1" /><span className="blob b2" /></div>
      <div className="container">
        <p className="eyebrow reveal">{eyebrow}</p>
        <h1 className="h1 reveal d1" style={{ marginTop: 14 }} dangerouslySetInnerHTML={{ __html: title }} />
        <p className="lead reveal d2">{lead}</p>
      </div>
    </section>
  );
}

export function BrandLogo({ height = 44 }) {
  return (
    <img
      src={BRAND.logoSrc}
      alt={BRAND.logoAlt}
      className="brand-logo-img"
      style={{ height, width: 'auto' }}
    />
  );
}
