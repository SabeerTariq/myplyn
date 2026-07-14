import { Link, useNavigate } from 'react-router-dom';
import { BRAND, brandEmail } from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';
import { getAdvertiserStartPath } from '../../utils/authRedirect';

const CONTACT_ROLE_ROUTES = {
  'Brand / advertiser': '/auth/signup/advertiser',
  'Creator / page owner': '/auth/signup/creator',
};

export default function LandingContact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const advertiserStartPath = getAdvertiserStartPath(user);

  const handleRoleChange = (event) => {
    const route = CONTACT_ROLE_ROUTES[event.target.value];
    if (route) navigate(route);
  };
  return (
    <>
      <section className="page-hero" style={{ paddingBottom: '30px' }}>
        <div className="hero-bg"><span className="blob b1"></span><span className="blob b2"></span></div>
        <div className="container">
          <p className="eyebrow reveal">CONTACT</p>
          <h1 className="h1 reveal d1" style={{ marginTop: '14px' }}>Let's talk</h1>
          <p className="lead reveal d2">Questions about launching a campaign, listing your pages, or a partnership? Send us a note and we'll get back within one business day.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="contact-grid">
            <form className="form reveal" onSubmit={(e) => e.preventDefault()}>
              <div className="two">
                <div className="field"><label htmlFor="fn">First name</label><input id="fn" type="text" placeholder="Maya" /></div>
                <div className="field"><label htmlFor="ln">Last name</label><input id="ln" type="text" placeholder="Rahman" /></div>
              </div>
              <div className="two">
                <div className="field"><label htmlFor="em">Email</label><input id="em" type="email" placeholder="you@email.com" /></div>
                <div className="field"><label htmlFor="role">I'm a…</label>
                  <select id="role" defaultValue="" onChange={handleRoleChange}>
                    <option value="" disabled>Select an option</option>
                    <option>Brand / advertiser</option>
                    <option>Creator / page owner</option>
                    <option>Press / partnership</option>
                    <option>Something else</option>
                  </select>
                </div>
              </div>
              <div className="field"><label htmlFor="sub">Subject</label><input id="sub" type="text" placeholder="How can we help?" /></div>
              <div className="field"><label htmlFor="msg">Message</label><textarea id="msg" placeholder="Tell us a bit more…"></textarea></div>
              <button className="btn btn-primary btn-lg btn-block">Send message
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></button>
            </form>

            <aside className="contact-side reveal d1">
              <div className="ci"><span className="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span><div><b>Email us</b><span>{brandEmail('hello')}<br />{BRAND.supportEmail}</span></div></div>
              <div className="ci"><span className="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><div><b>Live chat</b><span>In-app chat for signed-in brands and creators, 9am–6pm.</span></div></div>
              <div className="ci"><span className="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span><div><b>Where we are</b><span>A remote-first team working across Karachi, Dubai &amp; London.</span></div></div>
              <div className="ci" style={{ background: 'var(--indigo-50)', borderColor: 'var(--indigo-100)' }}><span className="ci-ico" style={{ background: '#fff' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></span><div><b>Looking for help?</b><span>Check <Link to="/how-it-works" style={{ color: 'var(--indigo-600)', fontWeight: '600' }}>how it works</Link> or <Link to="/pricing" style={{ color: 'var(--indigo-600)', fontWeight: '600' }}>pricing</Link> for quick answers.</span></div></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container"><div className="cta-band reveal">
          <h2>Or just dive in</h2>
          <p>You don't need to wait for a reply to get started — create your account in minutes.</p>
          <div className="hero-cta"><Link to={advertiserStartPath} className="btn btn-white btn-lg">Start as a brand</Link><Link to="/auth/signup/creator" className="btn btn-accent btn-lg">Join as a creator</Link></div>
        </div></div>
      </section>
    </>
  );
}
