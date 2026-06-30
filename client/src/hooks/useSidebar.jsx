import { useState } from 'react';

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  return { collapsed, toggle };
}
