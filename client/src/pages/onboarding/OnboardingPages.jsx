import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi, pagesApi } from '../../services/api';
import WizardStepper from '../../components/WizardStepper';
import BrandMark from '../../components/BrandMark';
import Icon from '../../components/Icon';
import CreatorPageFormFields, { buildPageFormState, buildPagePayload } from '../../components/creator/CreatorPageFormFields';
import { BRAND } from '../../config/brand';
import '../../styles/onboarding.css';
import '../../styles/creator-home.css';

const ADV_STEPS = ['Payment Method', 'First Campaign'];
const CRE_STEPS = ['List a Page', 'Connect Payouts'];

function OnboardingShell({ children, onSkip }) {
  return (
    <div className="onboarding-page">
      <header className="onboarding-topbar safe-top">
        <Link to="/">
          <BrandMark size={36} />
        </Link>
        {onSkip && (
          <button type="button" className="onboarding-topbar-skip" onClick={onSkip}>
            Skip all
          </button>
        )}
      </header>
      <div className="onboarding-body">
        {children}
      </div>
    </div>
  );
}

function StepFooter({
  step,
  totalSteps,
  onBack,
  onContinue,
  onSkip,
  continueLabel = 'Continue',
  loading = false,
}) {
  const isLast = step === totalSteps;
  return (
    <div className="onboarding-step-footer">
      <div className="onboarding-footer">
        {step > 1 && (
          <button type="button" className="btn-ghost" onClick={onBack} disabled={loading}>
            Back
          </button>
        )}
        <button type="button" className="btn-primary" onClick={onContinue} disabled={loading}>
          {loading ? 'Saving…' : (isLast ? continueLabel : 'Continue')}
        </button>
      </div>
      {onSkip && (
        <button type="button" className="onboarding-skip-step" onClick={onSkip} disabled={loading}>
          Skip for now
        </button>
      )}
    </div>
  );
}

function StepIntro({ icon, title, lead }) {
  return (
    <div className="onboarding-step-intro">
      {icon && (
        <span className="onboarding-step-icon">
          <Icon name={icon} size={22} />
        </span>
      )}
      <h2 className="onboarding-step-title">{title}</h2>
      {lead && <p className="onboarding-step-lead">{lead}</p>}
    </div>
  );
}

export function AdvertiserOnboarding() {
  const [step, setStep] = useState(1);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const total = ADV_STEPS.length;

  const persist = (done) => authApi.updateOnboarding({ step, done }).catch(() => {});

  const goNext = () => {
    persist(false);
    setStep((s) => Math.min(s + 1, total));
  };

  const finish = async () => {
    await persist(true);
    updateUser({ onboardingDone: true, onboardingStep: total });
    navigate('/advertiser');
  };

  const finishAndCreate = async () => {
    await persist(true);
    updateUser({ onboardingDone: true, onboardingStep: total });
    navigate('/advertiser/campaigns/new');
  };

  const skipAll = async () => {
    await authApi.updateOnboarding({ step: total, done: true }).catch(() => {});
    updateUser({ onboardingDone: true, onboardingStep: total });
    navigate('/advertiser');
  };

  return (
    <OnboardingShell onSkip={skipAll}>
      <div className="onboarding-card-wrap cc-animate-fade">
        <h1 className="page-title" style={{ marginBottom: 6 }}>Welcome to {BRAND.name}</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>Just two quick steps to launch your first campaign.</p>
        <WizardStepper steps={ADV_STEPS} currentStep={step} />

        <div className="card onboarding-card">
          {step === 1 && (
            <div>
              <StepIntro
                icon="credit_card"
                title="Add a payment method"
                lead="Fund campaigns and pay creators securely through Stripe. Mock mode is enabled for development."
              />
              <div className="onboarding-placeholder">
                <Icon name="lock" size={18} />
                Stripe payment method setup
              </div>
              <StepFooter
                step={step}
                totalSteps={total}
                onContinue={goNext}
                onSkip={goNext}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <StepIntro
                icon="campaign"
                title="Create your first campaign"
                lead="Publish a funded campaign to start connecting with creators, or head to your dashboard to explore first."
              />
              <div className="onboarding-cta-stack">
                <button type="button" onClick={finishAndCreate} className="btn-primary">Create campaign</button>
                <button type="button" onClick={finish} className="btn-ghost">Go to dashboard</button>
              </div>
              <div className="onboarding-step-footer onboarding-step-footer--center">
                <button type="button" className="onboarding-skip-step" onClick={() => setStep(1)}>Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}

export function CreatorOnboarding() {
  const [step, setStep] = useState(1);
  const [pageForm, setPageForm] = useState(buildPageFormState());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const total = CRE_STEPS.length;

  const persist = (done) => authApi.updateOnboarding({ step, done }).catch(() => {});

  const isPageStarted = pageForm.platformId || pageForm.name || pageForm.url || pageForm.followers;

  const submitPage = async () => {
    setLoading(true);
    setError('');
    try {
      await pagesApi.create(buildPagePayload(pageForm));
      await persist(false);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not submit your page.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageContinue = () => {
    if (!isPageStarted) {
      setStep(2);
      persist(false);
      return;
    }
    submitPage();
  };

  const finish = async () => {
    await persist(true);
    updateUser({ onboardingDone: true, onboardingStep: total });
    navigate('/creator');
  };

  const skipAll = async () => {
    await authApi.updateOnboarding({ step: total, done: true }).catch(() => {});
    updateUser({ onboardingDone: true, onboardingStep: total });
    navigate('/creator');
  };

  return (
    <OnboardingShell onSkip={skipAll}>
      <div className="onboarding-card-wrap cc-animate-fade">
        <h1 className="page-title" style={{ marginBottom: 6 }}>Welcome, creator!</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>List a page and connect payouts to start earning.</p>
        <WizardStepper steps={CRE_STEPS} currentStep={step} />

        <div className="card onboarding-card">
          {step === 1 && (
            <div>
              <StepIntro
                icon="add_photo_alternate"
                title="List your first page"
                lead="Add a social page so brands can discover you. It goes to admin review, then appears in the marketplace."
              />
              <CreatorPageFormFields form={pageForm} setForm={setPageForm} error={error} />
              <StepFooter
                step={step}
                totalSteps={total}
                onContinue={handlePageContinue}
                onSkip={() => { setStep(2); persist(false); }}
                loading={loading}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <StepIntro
                icon="account_balance"
                title="Connect payouts"
                lead="Link your Stripe account to withdraw earnings from completed collaborations. Mock mode is enabled for development."
              />
              <div className="onboarding-placeholder">
                <Icon name="lock" size={18} />
                Stripe Connect payout setup
              </div>
              <StepFooter
                step={step}
                totalSteps={total}
                onBack={() => setStep(1)}
                onContinue={finish}
                onSkip={finish}
                continueLabel="Finish"
              />
            </div>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}
