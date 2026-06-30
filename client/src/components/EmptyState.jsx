import Icon from './Icon';

export default function EmptyState({ title, description, action, icon = 'inbox' }) {
  return (
    <div className="card text-center" style={{ padding: '48px 24px' }}>
      <Icon name={icon} size={48} style={{ color: 'var(--border-2)', marginBottom: 16 }} />
      <h3 className="section-title" style={{ fontSize: 18 }}>{title}</h3>
      <p style={{ color: 'var(--text-3)', marginTop: 8, maxWidth: 400, margin: '8px auto 0' }}>{description}</p>
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}

export function SkeletonLoader({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse" style={{ height: 48, background: 'var(--surface-2)', borderRadius: 9 }} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="card text-center" style={{ padding: 32, borderColor: 'color-mix(in oklch, var(--bad) 30%, var(--border))', background: 'color-mix(in oklch, var(--bad) 5%, white)' }}>
      <Icon name="error" size={32} style={{ color: 'var(--bad)', marginBottom: 12 }} />
      <p style={{ color: 'var(--bad)' }}>{message || 'Something went wrong'}</p>
      {onRetry && <button type="button" onClick={onRetry} className="btn-ghost" style={{ marginTop: 16 }}>Try again</button>}
    </div>
  );
}
