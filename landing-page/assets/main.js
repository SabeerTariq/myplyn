/* CollabCircle — interactions & motion */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav scroll state + mobile menu ---------- */
const nav = document.querySelector('.nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 12);
onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

const burger = document.querySelector('.nav-toggle');
const mobile = document.querySelector('.mobile-menu');
if (burger && mobile){
  burger.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open'); document.body.style.overflow = '';
  }));
}

/* ---------- footer year ---------- */
const yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

/* ---------- hero perspective toggle ---------- */
(function(){
  const hero = document.querySelector('.hero[data-toggle]');
  if (!hero) return;
  const buttons = hero.querySelectorAll('.toggle button');
  const swaps = hero.querySelectorAll('[data-brand]');
  const setView = (view) => {
    hero.classList.toggle('creator-view', view === 'creator');
    buttons.forEach(b => b.classList.toggle('on', b.dataset.view === view));
    swaps.forEach(el => {
      el.classList.add('out');
      setTimeout(() => {
        el.textContent = view === 'creator' ? el.dataset.creator : el.dataset.brand;
        el.classList.remove('out');
      }, 220);
    });
    const b1 = hero.querySelector('.blob.b1'), b2 = hero.querySelector('.blob.b2');
    if (b1 && b2){
      b1.style.background = view === 'creator' ? 'var(--coral-300)' : 'var(--indigo-300)';
      b2.style.background = view === 'creator' ? 'var(--indigo-200)' : 'var(--coral-300)';
    }
  };
  buttons.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
})();

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.qa').forEach(qa => {
  const btn = qa.querySelector('button');
  const ans = qa.querySelector('.ans');
  btn.addEventListener('click', () => {
    const open = qa.classList.contains('open');
    document.querySelectorAll('.qa.open').forEach(o => {
      o.classList.remove('open'); o.querySelector('.ans').style.maxHeight = null;
    });
    if (!open){ qa.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
  });
});

/* ---------- Lenis smooth scroll + GSAP ---------- */
function initMotion(){
  const hasGSAP = window.gsap && window.ScrollTrigger;
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* Lenis */
  if (!reduce && window.Lenis){
    const lenis = new Lenis({ duration:1.1, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
    if (hasGSAP){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t*1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
    /* anchor + nav links smooth scroll */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)){
          e.preventDefault(); lenis.scrollTo(id, {offset:-90});
        }
      });
    });
  }

  /* reveal on scroll (works with or without GSAP) */
  const reveals = document.querySelectorAll('.reveal');
  if (reduce){ reveals.forEach(r => r.classList.add('in')); }
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    reveals.forEach(r => io.observe(r));
  }

  if (!hasGSAP || reduce) { runCounters(); return; }

  /* hero intro timeline */
  const heroEls = gsap.utils.toArray('[data-hero]');
  if (heroEls.length){
    gsap.from(heroEls, { y:26, opacity:0, duration:.9, ease:'power3.out', stagger:.09, delay:.15 });
  }
  /* floating cards parallax */
  gsap.utils.toArray('.float').forEach((el,i) => {
    gsap.to(el, { yPercent:i%2?8:-8, duration:3+i, ease:'sine.inOut', yoyo:true, repeat:-1 });
  });
  /* hero mock subtle tilt on scroll */
  const mock = document.querySelector('.mock-stage');
  if (mock){
    gsap.to(mock, { yPercent:-6, ease:'none',
      scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
  }

  /* how-it-works thread: activate steps as they pass */
  gsap.utils.toArray('.step').forEach((step) => {
    ScrollTrigger.create({
      trigger:step, start:'top center', end:'bottom center',
      onToggle:self => step.classList.toggle('act', self.isActive)
    });
  });

  runCounters(true);
}

/* ---------- animated counters ---------- */
function runCounters(useGSAP){
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec = (el.dataset.dec|0);
    const fmt = v => (dec? v.toFixed(dec): Math.round(v).toLocaleString()) + suffix;
    if (reduce || !useGSAP || !window.gsap){ el.textContent = fmt(end); return; }
    const obj = {v:0};
    ScrollTrigger.create({ trigger:el, start:'top 88%', once:true, onEnter:() => {
      gsap.to(obj,{v:end,duration:1.6,ease:'power2.out',onUpdate:()=>el.textContent=fmt(obj.v)});
    }});
  });
}

if (document.readyState !== 'loading') initMotion();
else document.addEventListener('DOMContentLoaded', initMotion);
