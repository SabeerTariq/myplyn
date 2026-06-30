import Icon from './Icon';

export default function KpiCard({ title, value, delta, deltaColor, icon, iconColor = 'var(--text-3)' }) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-[var(--text-2)] font-semibold leading-snug">{title}</span>
        {icon && <Icon name={icon} size={18} style={{ color: iconColor }} />}
      </div>
      <div className="text-[25px] font-extrabold tracking-tight leading-none">{value}</div>
      {delta && (
        <div className="text-[11.5px] font-semibold flex items-center gap-1" style={{ color: deltaColor || 'var(--ok)' }}>
          {delta}
        </div>
      )}
    </div>
  );
}
