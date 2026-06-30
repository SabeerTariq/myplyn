export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tabs-bar">
      {tabs.map((t) => {
        const key = typeof t === 'string' ? t : t.key;
        const label = typeof t === 'string' ? t : t.label;
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            className={`tab-btn ${isActive ? 'tab-btn-active' : ''}`}
            onClick={() => onChange?.(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
