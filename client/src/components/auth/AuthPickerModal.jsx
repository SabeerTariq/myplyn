import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';

export default function AuthPickerModal({
  open,
  onClose,
  title,
  options = [],
  value,
  onSelect,
  placeholder = 'Search…',
  searchable = false,
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) => item.label.toLowerCase().includes(q));
  }, [options, query]);

  if (!open) return null;

  return createPortal(
    <div className="auth-picker-overlay" role="presentation" onClick={onClose}>
      <div
        className="auth-picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-picker-sheet-head">
          <h3>{title}</h3>
          <button type="button" className="auth-picker-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>

        {(searchable || options.length > 8) && (
          <div className="auth-picker-search-wrap">
            <Icon name="search" size={18} />
            <input
              type="search"
              className="auth-picker-search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="auth-picker-list">
          {filtered.length === 0 ? (
            <p className="auth-picker-empty">No matches found.</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`auth-picker-option${value === item.value ? ' is-selected' : ''}`}
                onClick={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <span>{item.label}</span>
                {value === item.value && <Icon name="check" size={18} />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
