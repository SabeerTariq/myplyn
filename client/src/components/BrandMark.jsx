import { BRAND } from '../config/brand';

export default function BrandMark({ size = 30, fontSize, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center flex-none text-white font-extrabold ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: 'var(--accent)',
        fontSize: fontSize || Math.round(size * 0.53),
        letterSpacing: '-0.02em',
      }}
    >
      {BRAND.logoLetter}
    </div>
  );
}
