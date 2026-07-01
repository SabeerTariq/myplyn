import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import BrandMark from '../components/BrandMark';

export function AuthHeader({ active }) {
  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between" style={{ padding: '16px 24px' }}>
        <Link to="/" className="flex items-center gap-[11px]">
          <BrandMark />
          <span className="font-extrabold" style={{ fontSize: '15.5px', letterSpacing: '-0.02em' }}>{BRAND.name}</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5" style={{ fontSize: 14, color: 'var(--text-2)' }}>
          <Link to="/how-it-works" className="hover:text-[var(--accent-text)]">How it works</Link>
          <Link to="/pricing" className="hover:text-[var(--accent-text)]">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="btn-ghost text-sm"
            style={active === 'login' ? { color: 'var(--accent-text)', fontWeight: 600 } : undefined}
          >
            Log in
          </Link>
          <Link
            to="/auth/signup"
            className="btn-primary text-sm"
            style={active === 'signup' ? { filter: 'brightness(1.05)' } : undefined}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function AuthLayout({ children, active }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <AuthHeader active={active} />
      <main className="flex-1 flex items-center justify-center cc-animate-fade" style={{ padding: '40px 24px' }}>
        {children}
      </main>
    </div>
  );
}
