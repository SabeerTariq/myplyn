import { BRAND } from '../config/brand';

export default function BrandMark({ size = 36, className = '' }) {
  return (
    <img
      src={BRAND.logoSrc}
      alt={BRAND.logoAlt}
      className={`block object-contain flex-none ${className}`}
      style={{ height: size, width: 'auto' }}
    />
  );
}
