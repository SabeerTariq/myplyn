const HUES = [28, 158, 248, 62, 300, 200, 12, 130];

export function getAvatarStyle(seed, initials) {
  let h = 0;
  for (let i = 0; i < (seed || '').length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 360;
  }
  const hue = HUES[Math.abs(h) % HUES.length];
  return {
    initials: initials || seed?.slice(0, 2).toUpperCase() || '?',
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '12.5px',
      color: `oklch(0.4 0.12 ${hue})`,
      background: `oklch(0.92 0.05 ${hue})`,
    },
  };
}

export function getInitials(nameOrEmail) {
  if (!nameOrEmail) return '?';
  if (nameOrEmail.includes('@')) return nameOrEmail[0].toUpperCase();
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}
