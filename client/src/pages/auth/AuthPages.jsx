import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { authApi, pagesApi, taxonomyApi } from '../../services/api';
import { getPostLoginPath } from '../../utils/authRedirect';
import { brandEmail } from '../../config/brand';
import Icon from '../../components/Icon';
import BrandMark from '../../components/BrandMark';
import AuthPageShell, {
  AuthSocialButtons,
  AuthDivider,
  CreatorSocialButtons,
} from '../../layouts/AuthLayout';
import AuthLocationPickers, { getAuthLocationCity } from '../../components/auth/AuthLocationPickers';
import { OTHERS_NICHE_SLUG } from '../../utils/pageForm';

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

const ADVERTISER_SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbrand' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbrand' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourbrand' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbrand' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourbrand' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/yourbrand' },
];

function cleanSocialLinks(links = {}) {
  return Object.fromEntries(
    Object.entries(links).filter(([, value]) => typeof value === 'string' && value.trim()),
  );
}
const EMPTY_PAGE_DRAFT = {
  platformId: '',
  name: '',
  url: '',
  followers: '',
};

function getSignupProgress(role, creatorStep) {
  if (role === 'creator') {
    const labels = ['Account', 'Profile', 'Your pages'];
    return {
      stepLabel: `Step ${creatorStep} of 3`,
      stepName: labels[creatorStep - 1],
      width: `${(creatorStep / 3) * 100}%`,
    };
  }

  return {
    stepLabel: 'Step 2 of 2',
    stepName: 'Create account',
    width: '100%',
  };
}
const ADVERTISER_INDUSTRIES = [
  'Fashion & Beauty',
  'Food & Beverage',
  'Technology',
  'Health & Wellness',
  'Finance',
  'Entertainment',
  'Travel & Hospitality',
  'Retail & E-commerce',
  'Education',
  'Other',
];

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
  const isCreator = role === 'creator';
  const [creatorStep, setCreatorStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: '',
    companyName: '',
    website: '',
    industry: '',
    country: '',
    state: '',
    city: '',
    customCity: '',
    nicheId: '',
    customNiche: '',
    bio: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: '',
      youtube: '',
      x: '',
    },
  });
  const [pages, setPages] = useState([]);
  const [pageDraft, setPageDraft] = useState({ ...EMPTY_PAGE_DRAFT });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const variant = isCreator ? 'creator-signup' : 'advertiser-signup';
  const roleLabel = isCreator ? 'creator' : 'advertiser';
  const otpFromEmail = brandEmail('info');
  const progress = getSignupProgress(role, creatorStep);

  const { data: states } = useQuery({
    queryKey: ['states', form.country],
    queryFn: () => taxonomyApi.states(form.country).then((r) => r.data.states),
    enabled: !!form.country,
  });

  const { data: niches } = useQuery({
    queryKey: ['niches'],
    queryFn: () => taxonomyApi.niches().then((r) => r.data.niches),
    enabled: isCreator,
  });

  const othersNiche = niches?.find((n) => n.slug === OTHERS_NICHE_SLUG);
  const selectedNiche = niches?.find((n) => n.id === form.nicheId);
  const isOthersNiche = othersNiche && form.nicheId === othersNiche.id;

  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms),
    enabled: isCreator && creatorStep === 3,
  });

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

  const validateAccountStep = () => {
    if (!form.email) {
      setError('Enter your email address.');
      return false;
    }
    if (!otpSent) {
      setError('Send and enter the verification code from your email first.');
      return false;
    }
    if (form.otp.length !== 6) {
      setError('Enter the 6-digit verification code.');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };

  const validateProfileStep = () => {
    if (!form.country) {
      setError('Select your country.');
      return false;
    }
    if (states?.length > 0 && !form.state) {
      setError('Select your state or region.');
      return false;
    }
    if (!getAuthLocationCity(form)) {
      setError('Select or enter your city.');
      return false;
    }
    if (!form.nicheId) {
      setError('Select your primary niche.');
      return false;
    }
    if (isOthersNiche && !form.customNiche.trim()) {
      setError('Describe your niche when Others is selected.');
      return false;
    }
    return true;
  };

  const handleCreatorAccountContinue = (e) => {
    e.preventDefault();
    setError('');
    if (!validateAccountStep()) return;
    setCreatorStep(2);
  };

  const handleCreatorProfileContinue = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateProfileStep()) return;

    const nicheLabel = isOthersNiche
      ? form.customNiche.trim()
      : (selectedNiche?.name || '');

    setLoading(true);
    try {
      await signup({
        ...form,
        city: getAuthLocationCity(form),
        niche: nicheLabel,
        role: 'CREATOR',
      });
      setCreatorStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPage = () => {
    setError('');
    if (!pageDraft.platformId || !pageDraft.name.trim() || !pageDraft.url.trim() || !pageDraft.followers) {
      setError('Fill in platform, page name, profile URL, and followers to add a page.');
      return;
    }

    const followers = Number(pageDraft.followers);
    if (!Number.isFinite(followers) || followers < 0) {
      setError('Enter a valid follower count.');
      return;
    }

    const platformName = platforms?.find((p) => p.id === pageDraft.platformId)?.name || 'Page';
    setPages((current) => [
      ...current,
      {
        ...pageDraft,
        name: pageDraft.name.trim(),
        url: pageDraft.url.trim(),
        followers: String(followers),
        platformName,
      },
    ]);
    setPageDraft({ ...EMPTY_PAGE_DRAFT });
  };

  const buildSignupPagePayload = (page) => ({
    platformId: page.platformId,
    name: page.name,
    url: page.url,
    followers: parseInt(page.followers, 10),
    avgReach: 0,
    country: form.country,
    state: form.state || null,
    city: getAuthLocationCity(form),
    nicheId: form.nicheId || null,
    customNiche: isOthersNiche ? form.customNiche.trim() : null,
  });

  const finishCreatorSignup = async (skipPages = false) => {
    setLoading(true);
    setError('');
    try {
      if (!skipPages) {
        if (pages.length === 0) {
          setError('Add at least one page, or choose Skip for now.');
          setLoading(false);
          return;
        }
        for (const page of pages) {
          await pagesApi.create(buildSignupPagePayload(page));
        }
      }
      navigate('/creator/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save your pages');
    } finally {
      setLoading(false);
    }
  };

  const validateAdvertiserBusinessStep = () => {
    if (!form.country) {
      setError('Select your business country.');
      return false;
    }
    if (states?.length > 0 && !form.state) {
      setError('Select your state or region.');
      return false;
    }
    if (!getAuthLocationCity(form)) {
      setError('Select or enter your business city.');
      return false;
    }
    return true;
  };

  const handleAdvertiserSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccountStep()) return;
    if (!validateAdvertiserBusinessStep()) return;

    setLoading(true);
    setError('');
    try {
      await signup({
        ...form,
        city: getAuthLocationCity(form),
        socialLinks: cleanSocialLinks(form.socialLinks),
        role: 'ADVERTISER',
      });
      navigate('/advertiser/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const accountFields = (
    <>
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
    </>
  );

  const creatorProfileFields = (
    <div className="auth-creator-section">
      <p className="auth-section-title">Creator profile</p>
      <p className="auth-section-lead">Help brands understand who you are and where your audience is based.</p>

      <AuthLocationPickers
        value={form}
        onChange={(patch) => setForm({ ...form, ...patch })}
        countryLabel="Country"
        cityLabel="City"
      />

      <div className="auth-field">
        <label htmlFor="signup-niche">Primary niche</label>
        <select
          id="signup-niche"
          className="auth-input select"
          required
          value={form.nicheId}
          onChange={(e) => {
            const next = e.target.value;
            setForm({
              ...form,
              nicheId: next,
              customNiche: othersNiche && next === othersNiche.id ? form.customNiche : '',
            });
          }}
        >
          <option value="">Select your niche</option>
          {niches?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      {isOthersNiche && (
        <div className="auth-field">
          <label htmlFor="signup-custom-niche">Describe your niche</label>
          <input
            id="signup-custom-niche"
            className="auth-input"
            required
            placeholder="e.g. Pet care, Parenting, Automotive"
            value={form.customNiche}
            onChange={(e) => setForm({ ...form, customNiche: e.target.value })}
          />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="signup-bio">About you</label>
        <textarea
          id="signup-bio"
          className="auth-input auth-textarea"
          rows={3}
          placeholder="Tell brands what you create and who your audience is."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <p className="auth-field-hint">Optional — shown on your profile and proposals.</p>
      </div>
    </div>
  );

  const creatorPagesStep = (
    <div className="auth-creator-section">
      <p className="auth-section-title">List your pages</p>
      <p className="auth-section-lead">Add the social pages you want to monetize. You can add more later from your dashboard.</p>

      {pages.length > 0 && (
        <div className="auth-page-list">
          {pages.map((page, index) => (
            <div key={`${page.platformId}-${page.url}-${index}`} className="auth-page-card">
              <div className="auth-page-card-info">
                <strong>{page.name}</strong>
                <span>{page.platformName} · {Number(page.followers).toLocaleString()} followers</span>
              </div>
              <button
                type="button"
                className="auth-page-remove"
                onClick={() => setPages((current) => current.filter((_, i) => i !== index))}
                aria-label={`Remove ${page.name}`}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="auth-page-draft">
        <div className="auth-field">
          <label htmlFor="signup-page-platform">Platform</label>
          <select
            id="signup-page-platform"
            className="auth-input select"
            value={pageDraft.platformId}
            onChange={(e) => setPageDraft({ ...pageDraft, platformId: e.target.value })}
          >
            <option value="">Select platform</option>
            {platforms?.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-page-name">Page name</label>
          <input
            id="signup-page-name"
            className="auth-input"
            placeholder="@yourhandle or channel name"
            value={pageDraft.name}
            onChange={(e) => setPageDraft({ ...pageDraft, name: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-page-url">Profile URL</label>
          <input
            id="signup-page-url"
            type="url"
            className="auth-input"
            placeholder="https://instagram.com/yourpage"
            value={pageDraft.url}
            onChange={(e) => setPageDraft({ ...pageDraft, url: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-page-followers">Followers</label>
          <input
            id="signup-page-followers"
            type="number"
            min="0"
            className="auth-input"
            placeholder="e.g. 25000"
            value={pageDraft.followers}
            onChange={(e) => setPageDraft({ ...pageDraft, followers: e.target.value })}
          />
        </div>

        <button type="button" className="auth-add-page-btn" onClick={handleAddPage}>
          <Icon name="add" size={18} />
          Add page
        </button>
      </div>
    </div>
  );

  return (
    <AuthPageShell variant={variant}>
      <Link to="/auth/signup" className="auth-step-back">
        <Icon name="arrow_back" size={18} />
        Change account type
      </Link>

      <div className="auth-progress">
        <div className="auth-progress-top">
          <span>{progress.stepLabel}</span>
          <span>{progress.stepName}</span>
        </div>
        <div className="auth-progress-bar"><span style={{ width: progress.width }} /></div>
      </div>

      <h2>
        {isCreator && creatorStep === 3
          ? 'Add your social pages'
          : `Create your ${roleLabel} account`}
      </h2>
      <p className="auth-form-lead">
        {isCreator && creatorStep === 1 && 'Verify your email and set a secure password.'}
        {isCreator && creatorStep === 2 && 'Tell us about yourself so brands can find the right match.'}
        {isCreator && creatorStep === 3 && 'List the pages you want to use for brand collaborations.'}
        {!isCreator && 'Verify your email, then set up your business profile to launch your first campaign.'}
      </p>

      {isCreator ? (
        <>
          {creatorStep === 1 && (
            <form onSubmit={handleCreatorAccountContinue}>
              {accountFields}
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-submit">Continue</button>
              <p className="auth-switch">
                Already have an account? <Link to="/auth/login/creator">Log in</Link>
              </p>
            </form>
          )}

          {creatorStep === 2 && (
            <form onSubmit={handleCreatorProfileContinue}>
              {creatorProfileFields}
              {error && <p className="auth-error">{error}</p>}
              <div className="auth-step-actions">
                <button type="button" className="btn-ghost auth-step-back-btn" onClick={() => setCreatorStep(1)}>Back</button>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Continue'}
                </button>
              </div>
              <p className="auth-switch">
                Already have an account? <Link to="/auth/login/creator">Log in</Link>
              </p>
            </form>
          )}

          {creatorStep === 3 && (
            <div>
              {creatorPagesStep}
              {error && <p className="auth-error">{error}</p>}
              <div className="auth-step-actions">
                <button type="button" className="auth-submit" disabled={loading} onClick={() => finishCreatorSignup(false)}>
                  {loading ? 'Saving pages…' : 'Finish signup'}
                </button>
              </div>
              <button type="button" className="auth-skip-link" disabled={loading} onClick={() => finishCreatorSignup(true)}>
                Skip for now
              </button>
              <p className="auth-switch">
                Already have an account? <Link to="/auth/login/creator">Log in</Link>
              </p>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleAdvertiserSubmit}>
          {accountFields}
          <div className="auth-advertiser-section">
            <p className="auth-section-title">Business details</p>
            <p className="auth-section-lead">Tell us about your brand so we can tailor your dashboard and creator matches.</p>

            <div className="auth-field">
              <label htmlFor="signup-company">Company name</label>
              <input
                id="signup-company"
                className="auth-input"
                placeholder="Your business or brand name"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-website">Website</label>
              <input
                id="signup-website"
                type="url"
                className="auth-input"
                placeholder="https://yourcompany.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <p className="auth-field-hint">Optional — helps creators learn about your brand.</p>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-industry">Industry</label>
              <select
                id="signup-industry"
                className="auth-input select"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              >
                <option value="">Select your industry</option>
                {ADVERTISER_INDUSTRIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <AuthLocationPickers
              value={form}
              onChange={(patch) => setForm({ ...form, ...patch })}
              countryLabel="Country"
              cityLabel="City"
            />

            <div className="auth-social-section">
              <p className="auth-section-title">Social links</p>
              <p className="auth-section-lead">Optional — help creators verify and learn about your brand presence.</p>
              <div className="auth-social-grid">
                {ADVERTISER_SOCIAL_FIELDS.map((item) => (
                  <div key={item.key} className="auth-field">
                    <label htmlFor={`signup-social-${item.key}`}>{item.label}</label>
                    <input
                      id={`signup-social-${item.key}`}
                      type="url"
                      className="auth-input"
                      placeholder={item.placeholder}
                      value={form.socialLinks[item.key]}
                      onChange={(e) => setForm({
                        ...form,
                        socialLinks: { ...form.socialLinks, [item.key]: e.target.value },
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/auth/login/advertiser">Log in</Link>
          </p>
        </form>
      )}
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
