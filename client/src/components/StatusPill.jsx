import { getPillStyle } from '../utils/pill';

export default function StatusPill({ status, label }) {
  const pill = getPillStyle(status);
  const displayLabel = label || pill.label;
  return (
    <span style={pill.style}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: pill.dotColor, flexShrink: 0 }} />
      {displayLabel}
    </span>
  );
}
