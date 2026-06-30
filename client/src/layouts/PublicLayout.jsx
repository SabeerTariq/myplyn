import { Link, Outlet } from 'react-router-dom';
import { BRAND } from '../config/brand';
import BrandMark from '../components/BrandMark';

export default function PublicLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between" style={{ padding: '16px 30px' }}>
          <Link to="/" className="flex items-center gap-[11px]">
            <BrandMark />
            <span className="font-extrabold" style={{ fontSize: '15.5px', letterSpacing: '-0.02em' }}>{BRAND.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6" style={{ fontSize: 14, color: 'var(--text-2)' }}>
            <Link to="/how-it-works" className="hover:text-[var(--accent-text)]">How It Works</Link>
            <Link to="/pricing" className="hover:text-[var(--accent-text)]">Pricing</Link>
            <Link to="/about" className="hover:text-[var(--accent-text)]">About</Link>
            <Link to="/contact" className="hover:text-[var(--accent-text)]">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="btn-ghost text-sm">Log in</Link>
            <Link to="/auth/signup" className="btn-primary text-sm">Sign up</Link>
          </div>
        </div>
      </header>
      <Outlet />
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', marginTop: 64 }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6" style={{ padding: '32px 30px', fontSize: 13, color: 'var(--text-3)' }}>
          <Link to="/terms" className="hover:text-[var(--text)">Terms</Link>
          <Link to="/privacy" className="hover:text-[var(--text)">Privacy</Link>
          <span className="ml-auto">&copy; 2026 {BRAND.name}</span>
        </div>
      </footer>
    </div>
  );
}
