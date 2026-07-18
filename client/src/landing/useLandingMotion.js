import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NAV_OFFSET = -90;

export function scrollToLandingHash(hash, { immediate = false } = {}) {
  if (!hash || typeof window === 'undefined') return;
  const target = hash.startsWith('#') ? hash : `#${hash}`;
  const el = document.querySelector(target);
  if (!el) return;

  const lenis = window.__landingLenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(target, { offset: NAV_OFFSET, immediate });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: immediate || reduce ? 'auto' : 'smooth' });
}

export function scrollLandingTop({ immediate = true } = {}) {
  const lenis = window.__landingLenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { immediate, force: true });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function runCounters(useGSAP) {
  document.querySelectorAll('.landing-site [data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec = el.dataset.dec | 0;
    const fmt = (v) => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suffix;
    if (reduce || !useGSAP) {
      el.textContent = fmt(end);
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = fmt(obj.v); },
        });
      },
    });
  });
}

function initMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.killTweensOf('.landing-site [data-hero]');
  gsap.killTweensOf('.landing-site .float');
  gsap.killTweensOf('.landing-site .hero-float, .landing-site .hero-social');
  gsap.set('.landing-site [data-hero]', { opacity: 1, y: 0, clearProps: 'opacity,transform' });

  let lenis;
  let heroTween;

  if (!reduce) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true });
    window.__landingLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('.landing-site a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          scrollToLandingHash(id);
        }
      });
    });
  }

  const reveals = document.querySelectorAll('.landing-site .reveal');
  if (reduce) {
    reveals.forEach((r) => r.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((r) => io.observe(r));
  }

  if (reduce) {
    runCounters(false);
    return () => {
      lenis?.destroy();
      delete window.__landingLenis;
    };
  }

  const heroEls = gsap.utils.toArray('.landing-site [data-hero]');
  if (heroEls.length) {
    heroTween = gsap.from(heroEls, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
      clearProps: 'opacity,transform',
    });
  }

  gsap.utils.toArray('.landing-site .hero-float, .landing-site .hero-social').forEach((el, i) => {
    gsap.to(el, { yPercent: i % 2 ? 6 : -6, duration: 3 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  const heroVisual = document.querySelector('.landing-site .hero-visual');
  if (heroVisual) {
    gsap.to(heroVisual, {
      yPercent: -4,
      ease: 'none',
      scrollTrigger: { trigger: '.landing-site .hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  gsap.utils.toArray('.landing-site .step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => step.classList.toggle('act', self.isActive),
    });
  });

  runCounters(true);

  return () => {
    heroTween?.kill();
    gsap.killTweensOf('.landing-site [data-hero]');
    gsap.killTweensOf('.landing-site .hero-float, .landing-site .hero-social');
    gsap.set('.landing-site [data-hero]', { opacity: 1, y: 0, clearProps: 'opacity,transform' });
    lenis?.destroy();
    delete window.__landingLenis;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

export function useLandingMotion() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('landing-active', 'js');
    document.body.classList.add('landing-active');
    return () => {
      document.documentElement.classList.remove('landing-active', 'js');
      document.body.classList.remove('landing-active');
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let cleanup;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) cleanup = initMotion();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup?.();
      gsap.killTweensOf('.landing-site [data-hero]');
      gsap.set('.landing-site [data-hero]', { opacity: 1, y: 0, clearProps: 'opacity,transform' });
    };
  }, [pathname]);

  useEffect(() => {
    if (!hash) return undefined;
    const timer = window.setTimeout(() => {
      scrollToLandingHash(hash, { immediate: reduce });
    }, pathname === '/' ? 0 : 120);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
}

export function useHeroToggle() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') return undefined;

    const hero = document.querySelector('.landing-site .hero[data-toggle]');
    if (!hero) return undefined;

    const buttons = hero.querySelectorAll('.toggle button');
    const swaps = hero.querySelectorAll('[data-brand]');

    const setView = (view) => {
      hero.classList.toggle('creator-view', view === 'creator');
      buttons.forEach((b) => b.classList.toggle('on', b.dataset.view === view));
      swaps.forEach((el) => {
        el.classList.add('out');
        setTimeout(() => {
          el.textContent = view === 'creator' ? el.dataset.creator : el.dataset.brand;
          el.classList.remove('out');
        }, 220);
      });
      const b1 = hero.querySelector('.blob.b1');
      const b2 = hero.querySelector('.blob.b2');
      if (b1 && b2) {
        b1.style.background = view === 'creator' ? 'var(--coral-300)' : 'var(--indigo-300)';
        b2.style.background = view === 'creator' ? 'var(--indigo-200)' : 'var(--coral-300)';
      }
    };

    buttons.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    return () => buttons.forEach((b) => b.replaceWith(b.cloneNode(true)));
  }, [pathname]);
}

export function useFaqAccordion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const handlers = [];
    document.querySelectorAll('.landing-site .qa:not([data-controlled])').forEach((qa) => {
      const btn = qa.querySelector('button');
      const ans = qa.querySelector('.ans');
      const handler = () => {
        const open = qa.classList.contains('open');
        document.querySelectorAll('.landing-site .qa.open').forEach((o) => {
          o.classList.remove('open');
          o.querySelector('.ans').style.maxHeight = null;
        });
        if (!open) {
          qa.classList.add('open');
          ans.style.maxHeight = `${ans.scrollHeight}px`;
        }
      };
      btn.addEventListener('click', handler);
      handlers.push({ btn, handler });
    });
    return () => handlers.forEach(({ btn, handler }) => btn.removeEventListener('click', handler));
  }, [pathname]);
}

export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector('.landing-site .nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

export function useMobileMenu() {
  useEffect(() => {
    const burger = document.querySelector('.landing-site .nav-toggle');
    const mobile = document.querySelector('.landing-site .mobile-menu');
    if (!burger || !mobile) return undefined;

    const toggle = () => {
      const open = mobile.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    const close = () => {
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', toggle);
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    return () => {
      burger.removeEventListener('click', toggle);
      document.body.style.overflow = '';
    };
  }, []);
}
