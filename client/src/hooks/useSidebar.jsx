import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsDesktop } from './useMediaQuery';

export function useSidebar() {
  const isDesktop = useIsDesktop();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    if (isDesktop) {
      setCollapsed((c) => {
        const next = !c;
        localStorage.setItem('sidebarCollapsed', String(next));
        return next;
      });
    } else {
      setMobileOpen((o) => !o);
    }
  }, [isDesktop]);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  }, [location.pathname, isDesktop]);

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop && mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    return undefined;
  }, [isDesktop, mobileOpen]);

  return {
    collapsed,
    toggle,
    isDesktop,
    mobileOpen,
    openMobile,
    closeMobile,
    expanded: isDesktop ? !collapsed : true,
  };
}
