import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/api';
import WizardStepper from '../../components/WizardStepper';
import { BRAND } from '../../config/brand';

const ADV_STEPS = ['Business Profile', 'Payment Method', 'First Campaign'];
const CRE_STEPS = ['Profile', 'List a Page', 'Connect Payouts'];

export function AdvertiserOnboarding() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ companyName: '', website: '', industry: '', country: '', city: '', description: '' });
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const finish = async (done = false) => {
    await authApi.updateOnboarding({ step, done, profile });
    if (done) {
      updateUser({ onboardingDone: true, onboardingStep: 3 });
      navigate('/advertiser');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
      <div className="max-w-2xl mx-auto cc-animate-fade">
        <h1 className="page-title" style={{ marginBottom: 8 }}>Welcome to {BRAND.name}</h1>
        <p className="text-muted" style={{ marginBottom: 32 }}>Let's set up your advertiser account</p>
        <WizardStepper steps={ADV_STEPS} currentStep={step} />
        <div className="card">
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="label">Company name</label><input className="input" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} /></div>
              <div><label className="label">Website</label><input className="input" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} /></div>
              <div><label className="label">Industry</label><input className="input" value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Country</label><input className="input" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} /></div>
                <div><label className="label">City</label><input className="input" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
              </div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} /></div>
              <button onClick={() => finish(false)} className="btn-primary">Continue</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <p className="text-subtle" style={{ marginBottom: 16 }}>Add a payment method via Stripe (mock mode enabled for dev).</p>
              <div className="panel-muted text-center text-muted" style={{ padding: 32, border: '1px dashed var(--border)', borderRadius: 10 }}>Stripe payment method placeholder</div>
              <button onClick={() => finish(false)} className="btn-primary" style={{ marginTop: 16 }}>Continue</button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="text-subtle" style={{ marginBottom: 24 }}>Ready to create your first campaign?</p>
              <button onClick={() => finish(true)} className="btn-primary" style={{ marginRight: 12 }}>Go to dashboard</button>
              <button onClick={() => { finish(true); navigate('/advertiser/campaigns/new'); }} className="btn-ghost">Create campaign</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreatorOnboarding() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ country: '', city: '', bio: '' });
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const finish = async (done = false) => {
    await authApi.updateOnboarding({ step, done, profile });
    if (done) {
      updateUser({ onboardingDone: true, onboardingStep: 3 });
      navigate('/creator');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
      <div className="max-w-2xl mx-auto cc-animate-fade">
        <h1 className="page-title" style={{ marginBottom: 8 }}>Welcome, Creator!</h1>
        <WizardStepper steps={CRE_STEPS} currentStep={step} />
        <div className="card" style={{ marginTop: 24 }}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Country</label><input className="input" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} /></div>
                <div><label className="label">City</label><input className="input" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
              </div>
              <div><label className="label">Bio</label><textarea className="input" rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
              <button onClick={() => finish(false)} className="btn-primary">Continue</button>
            </div>
          )}
          {step === 2 && (
            <div className="text-center">
              <p className="text-subtle" style={{ marginBottom: 16 }}>List your first social page from the dashboard.</p>
              <button onClick={() => finish(false)} className="btn-primary">Continue</button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="text-subtle" style={{ marginBottom: 16 }}>Connect Stripe to receive payouts (mock mode available).</p>
              <button onClick={() => finish(true)} className="btn-primary">Finish setup</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
