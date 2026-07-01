import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  gsap.set('.landing-site [data-hero]', { opacity: 1, y: 0, clearProps: 'opacity,transform' });

  let lenis;
  let heroTween;

  if (!reduce) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('.landing-site a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -90 });
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
    return () => { lenis?.destroy(); };
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

  gsap.utils.toArray('.landing-site .float').forEach((el, i) => {
    gsap.to(el, { yPercent: i % 2 ? 8 : -8, duration: 3 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  const mock = document.querySelector('.landing-site .mock-stage');
  if (mock) {
    gsap.to(mock, {
      yPercent: -6,
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
    gsap.killTweensOf('.landing-site .float');
    gsap.set('.landing-site [data-hero]', { opacity: 1, y: 0, clearProps: 'opacity,transform' });
    lenis?.destroy();
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
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
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
  useEffect(() => {
    const handlers = [];
    document.querySelectorAll('.landing-site .qa').forEach((qa) => {
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
  }, []);
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
