import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { getAvatarStyle, getInitials } from '../../utils/avatar';
import { getPlatformIcon } from '../../utils/creatorMetrics';

export function ScoreRing({ value, size = 44 }) {
  const radius = size * 0.39;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const stroke = value >= 85 ? '#1ea24c' : value >= 70 ? '#e6a700' : '#9aa5b5';
  const center = size / 2;

  return (
    <div className="dashboard-score-ring" aria-label={`Score ${value}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#edf1f5" strokeWidth="4" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.25} fontWeight="700" fill="#0e2a5e">
          {value}
        </text>
      </svg>
    </div>
  );
}

export function PageStatus({ status }) {
  const active = status === 'VERIFIED';
  const pending = status === 'PENDING';
  const rejected = status === 'REJECTED';
  const color = active ? '#1ea24c' : pending ? '#e6a700' : rejected ? '#d64545' : '#9aa5b5';
  const label = active ? 'Verified' : pending ? 'Pending review' : rejected ? 'Rejected' : 'Inactive';

  return (
    <span className="dashboard-status-pill">
      <span className="dashboard-status-dot" style={{ background: color }} />
      {label}
    </span>
  );
}

export function PageIdentity({ page, subtitle }) {
  const avatar = getAvatarStyle(page.name, getInitials(page.name));
  const platformIcon = getPlatformIcon(page.platform?.slug);

  return (
    <div className="dashboard-page-identity">
      <div className="dashboard-page-avatar-wrap">
        <div className="dashboard-page-avatar" style={avatar.style}>{avatar.initials}</div>
        {platformIcon && (
          <span className="dashboard-page-platform">
            <img src={platformIcon} alt="" width={14} height={14} />
          </span>
        )}
      </div>
      <div>
        <span className="dashboard-page-name">{page.name}</span>
        {subtitle && <span className="cr-page-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}

export function QuickActionCard({ icon, title, desc, to, onClick, accent }) {
  const inner = (
    <>
      <span className={`cr-quick-icon ${accent ? 'cr-quick-icon--accent' : ''}`}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <Icon name="chevron_right" size={20} className="cr-quick-chevron" />
    </>
  );

  if (to) {
    return <Link to={to} className="cr-quick-card">{inner}</Link>;
  }

  return (
    <button type="button" className="cr-quick-card" onClick={onClick}>
      {inner}
    </button>
  );
}
