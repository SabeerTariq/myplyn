import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/api';
import Icon from '../../components/Icon';
import BrandMark from '../../components/BrandMark';
import { BRAND } from '../../config/brand';

export function SignupRolePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center cc-animate-fade" style={{ background: 'var(--bg)', padding: 24 }}>
      <div className="max-w-2xl w-full">
        <div className="text-center" style={{ marginBottom: 32 }}>
          <Link to="/" className="inline-flex items-center gap-[11px]" style={{ marginBottom: 24 }}>
            <BrandMark size={36} fontSize={18} />
            <span className="font-extrabold" style={{ fontSize: 18 }}>{BRAND.name}</span>
          </Link>
          <h1 className="page-title" style={{ fontSize: 24 }}>Join as…</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { role: 'advertiser', title: 'Advertiser', desc: 'Create campaigns and find creators', icon: 'campaign' },
            { role: 'creator', title: 'Creator', desc: 'List pages and earn from collaborations', icon: 'groups' },
          ].map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => navigate(`/auth/signup/${r.role}`)}
              className="card text-left transition-all hover:border-[var(--accent)]"
              style={{ cursor: 'pointer' }}
            >
              <Icon name={r.icon} size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
              <h2 className="section-title">{r.title}</h2>
              <p style={{ color: 'var(--text-3)', marginTop: 8, fontSize: 13 }}>{r.desc}</p>
            </button>
          ))}
        </div>
        <p className="text-center" style={{ marginTop: 24, fontSize: 13, color: 'var(--text-3)' }}>
          Already have an account? <Link to="/auth/login" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export function SignupFormPage({ role }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', companyName: '', country: '', niche: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await signup({ ...form, role: role.toUpperCase() });
      navigate(user.role === 'ADVERTISER' ? '/advertiser/onboarding' : '/creator/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout title={`Sign up as ${role}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Email</label><input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Password</label><input type="password" className="input" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        {role === 'advertiser' && (
          <div><label className="label">Company name</label><input className="input" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
        )}
        {role === 'creator' && (
          <>
            <div><label className="label">Country</label><input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div><label className="label">Primary niche</label><input className="input" value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} /></div>
          </>
        )}
        {error && <p style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthFormLayout>
  );
}

export function LoginPage({ admin = false }) {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authLoading && user) {
    if (admin && user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (!admin && user.role !== 'ADMIN') {
      const dest = !user.onboardingDone
        ? (user.role === 'ADVERTISER' ? '/advertiser/onboarding' : '/creator/onboarding')
        : (user.role === 'ADVERTISER' ? '/advertiser' : '/creator');
      return <Navigate to={dest} replace />;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form, admin);
      if (!admin && !user.onboardingDone) {
        navigate(user.role === 'ADVERTISER' ? '/advertiser/onboarding' : '/creator/onboarding');
        return;
      }
      navigate(user.role === 'ADVERTISER' ? '/advertiser' : user.role === 'CREATOR' ? '/creator' : '/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout title={admin ? 'Admin Login' : 'Log in'} admin={admin}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="label">Email</label><input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Password</label><input type="password" className="input" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        {!admin && <Link to="/auth/forgot-password" style={{ fontSize: 13, color: 'var(--accent-text)' }}>Forgot password?</Link>}
        {error && <p style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</p>}
        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      {!admin && (
        <p className="text-center" style={{ marginTop: 16, fontSize: 13, color: 'var(--text-3)' }}>
          No account? <Link to="/auth/signup" style={{ color: 'var(--accent-text)', fontWeight: 600 }}>Sign up</Link>
        </p>
      )}
    </AuthFormLayout>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout title="Forgot password">
      {sent ? (
        <p style={{ textAlign: 'center', color: 'var(--text-2)' }}>Check your inbox for reset instructions.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          {error && <p style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
    </AuthFormLayout>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  return (
    <AuthFormLayout title="Reset password">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div><label className="label">New password</label><input type="password" className="input" required minLength={8} /></div>
        <button type="submit" className="btn-primary w-full justify-center">Update password</button>
        {!token && <p style={{ fontSize: 13, color: 'var(--warn)' }}>No token provided — use link from email.</p>}
      </form>
    </AuthFormLayout>
  );
}

function AuthFormLayout({ title, children, admin }) {
  return (
    <div className="min-h-screen flex items-center justify-center cc-animate-fade" style={{ background: 'var(--bg)', padding: 24 }}>
      <div className="card w-full max-w-md">
        <Link to={admin ? '/admin/login' : '/'} className="inline-flex items-center gap-[11px]" style={{ marginBottom: 24 }}>
          <BrandMark />
          <span className="font-extrabold" style={{ fontSize: '15.5px' }}>{BRAND.name}</span>
        </Link>
        <h1 className="section-title" style={{ fontSize: 20, marginBottom: 24 }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}
