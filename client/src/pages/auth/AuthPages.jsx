import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/api';
import { getPostLoginPath } from '../../utils/authRedirect';
import { brandEmail } from '../../config/brand';
import Icon from '../../components/Icon';
import BrandMark from '../../components/BrandMark';
import AuthPageShell, {
  AuthSocialButtons,
  AuthDivider,
  CreatorSocialButtons,
} from '../../layouts/AuthLayout';

function PasswordField({ value, onChange, placeholder = 'Enter your password', required = true, minLength }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-input-wrap">
      <input
        type={visible ? 'text' : 'password'}
        className="auth-input"
        style={{ paddingRight: 44 }}
        required={required}
        minLength={minLength}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <button
        type="button"
        className="auth-input-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <Icon name={visible ? 'visibility_off' : 'visibility'} size={20} />
      </button>
    </div>
  );
}

const ROLE_OPTIONS = [
  {
    role: 'creator',
    title: 'Creator',
    desc: 'List your social pages, apply to campaigns, and get paid for collaborations.',
    icon: 'groups',
    perks: ['List unlimited pages', 'Marketplace access', 'Stripe payouts'],
  },
  {
    role: 'advertiser',
    title: 'Advertiser',
    desc: 'Launch campaigns, discover creators, and track results from one dashboard.',
    icon: 'campaign',
    perks: ['Campaign wizard', 'Creator discovery', 'Proof verification'],
  },
];

export function SignupRolePage() {
  const navigate = useNavigate();

  return (
    <AuthPageShell variant="signup">
      <div className="auth-progress">
        <div className="auth-progress-top">
          <span>Step 1 of 2</span>
          <span>Account type</span>
        </div>
        <div className="auth-progress-bar"><span style={{ width: '50%' }} /></div>
      </div>

      <h2>Join Myplyn</h2>
      <p className="auth-form-lead">Choose how you want to use the platform.</p>

      <div className="auth-role-grid">
        {ROLE_OPTIONS.map((item) => (
          <button
            key={item.role}
            type="button"
            className={`auth-role-card auth-role-card--${item.role}`}
            onClick={() => navigate(`/auth/signup/${item.role}`)}
          >
            <span className={`auth-role-icon auth-role-icon--${item.role}`}>
              <Icon name={item.icon} size={22} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <ul className="auth-role-perks">
              {item.perks.map((perk) => (
                <li key={perk}>
                  <Icon name="check_circle" size={14} />
                  {perk}
                </li>
              ))}
            </ul>
            <span className="auth-role-cta">
              Continue as {item.title.toLowerCase()}
              <Icon name="arrow_forward" size={16} />
            </span>
          </button>
        ))}
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/auth/login">Log in</Link>
      </p>
    </AuthPageShell>
  );
}

export function SignupFormPage({ role }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', otp: '', companyName: '', country: '', niche: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const variant = role === 'creator' ? 'creator-signup' : 'advertiser-signup';
  const roleLabel = role === 'creator' ? 'creator' : 'advertiser';
  const otpFromEmail = brandEmail('info');

  useEffect(() => {
    if (!otpCooldown) return undefined;
    const timer = window.setInterval(() => {
      setOtpCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setError('');
    try {
      await authApi.sendSignupOtp(form.email);
      setOtpSent(true);
      setOtpCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      setError('Send and enter the verification code from your email first.');
      return;
    }
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
    <AuthPageShell variant={variant}>
      <Link to="/auth/signup" className="auth-step-back">
        <Icon name="arrow_back" size={18} />
        Change account type
      </Link>

      <div className="auth-progress">
        <div className="auth-progress-top">
          <span>Step 2 of 2</span>
          <span>Create account</span>
        </div>
        <div className="auth-progress-bar"><span style={{ width: '100%' }} /></div>
      </div>

      <h2>Create your {roleLabel} account</h2>
      <p className="auth-form-lead">
        {role === 'creator'
          ? 'Verify your email, then set up your profile to list pages and start earning.'
          : 'Verify your email, then set up your business profile to launch your first campaign.'}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <div className="auth-otp-row">
            <input
              id="signup-email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value, otp: '' });
                setOtpSent(false);
              }}
            />
            <button
              type="button"
              className="auth-otp-send"
              disabled={!form.email || sendingOtp || otpCooldown > 0}
              onClick={handleSendOtp}
            >
              {sendingOtp ? 'Sending…' : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : otpSent ? 'Resend code' : 'Send code'}
            </button>
          </div>
          <p className="auth-otp-hint">
            We&apos;ll email a 6-digit code from {otpFromEmail}.
          </p>
        </div>

        {otpSent && (
          <div className="auth-field">
            <label htmlFor="signup-otp">Verification code</label>
            <input
              id="signup-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="auth-input auth-otp-input"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            />
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <PasswordField
            value={form.password}
            minLength={8}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {role === 'advertiser' && (
          <div className="auth-field">
            <label htmlFor="signup-company">Company name</label>
            <input
              id="signup-company"
              className="auth-input"
              placeholder="Your business name"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
        )}

        {role === 'creator' && (
          <>
            <div className="auth-field">
              <label htmlFor="signup-country">Country</label>
              <input
                id="signup-country"
                className="auth-input"
                placeholder="Where are you based?"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-niche">Primary niche</label>
              <input
                id="signup-niche"
                className="auth-input"
                placeholder="e.g. Fashion, Food, Tech"
                value={form.niche}
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
              />
            </div>
          </>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to={`/auth/login/${role}`}>Log in</Link>
        </p>
      </form>
    </AuthPageShell>
  );
}

export function LoginPage({ admin = false, role = null }) {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(role === 'advertiser' ? 'advertiser' : 'creator');

  if (authLoading) {
    return (
      <div className="auth-admin-wrap">
        <div className="animate-spin rounded-full" style={{ width: 32, height: 32, border: '4px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (user) {
    if (admin && user.role !== 'ADMIN') {
      return <Navigate to={getPostLoginPath(user)} replace />;
    }
    if (!admin && user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={getPostLoginPath(user)} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedIn = await login(form, admin);
      navigate(getPostLoginPath(loggedIn));
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goEmailSignup = () => {
    navigate(`/auth/signup/${activeRole}`);
  };

  if (admin) {
    return (
      <div className="auth-admin-wrap cc-animate-fade">
        <div className="auth-admin-card">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <BrandMark size={44} />
            <h2 style={{ margin: '16px 0 6px', fontSize: 22, color: '#0e2a5e' }}>Admin login</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#71809a' }}>Administrator access only</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                className="auth-input"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="admin-password">Password</label>
              <PasswordField value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isCreator = activeRole === 'creator';

  return (
    <AuthPageShell variant={`${activeRole}-login`}>
      <h2>Log in as {isCreator ? 'a creator' : 'an advertiser'}</h2>

      <div className="auth-role-tabs" role="tablist" aria-label="Account type">
        <button
          type="button"
          role="tab"
          aria-selected={isCreator}
          className={`auth-role-tab ${isCreator ? 'is-active' : ''}`}
          onClick={() => setActiveRole('creator')}
        >
          <Icon name="person" size={18} />
          Creator
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isCreator}
          className={`auth-role-tab ${!isCreator ? 'is-active' : ''}`}
          onClick={() => setActiveRole('advertiser')}
        >
          <Icon name="storefront" size={18} />
          Advertiser
        </button>
      </div>

      {isCreator ? (
        <CreatorSocialButtons onSignup={goEmailSignup} />
      ) : (
        <AuthSocialButtons onSignup={goEmailSignup} />
      )}
      <AuthDivider />

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="auth-input"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <PasswordField
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/auth/signup">Sign up</Link>
      </p>
    </AuthPageShell>
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
    <AuthPageShell variant="login">
      <h2>Reset your password</h2>
      <p className="auth-marketing-lead" style={{ marginTop: -12, marginBottom: 20 }}>
        Enter your email and we&apos;ll send you reset instructions.
      </p>

      {sent ? (
        <p style={{ color: '#37485f', fontSize: 14, lineHeight: 1.6 }}>
          Check your inbox for reset instructions. If you don&apos;t see the email, check your spam folder.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="auth-switch">
        <Link to="/auth/login">Back to log in</Link>
      </p>
    </AuthPageShell>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell variant="login">
      <h2>Set a new password</h2>
      {done ? (
        <p style={{ color: '#37485f', fontSize: 14 }}>Password updated. Redirecting to log in…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="new-password">New password</label>
            <PasswordField
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!token && <p className="auth-error">No token provided — use the link from your email.</p>}
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading || !token}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
      <p className="auth-switch">
        <Link to="/auth/login">Back to log in</Link>
      </p>
    </AuthPageShell>
  );
}
