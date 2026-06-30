export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 400, md: 480, lg: 640, xl: 800 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: 16 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div
        className="relative w-full overflow-auto cc-animate-fade"
        style={{
          maxWidth: sizes[size],
          maxHeight: '90vh',
          background: 'var(--surface)',
          borderRadius: 14,
          border: '1px solid var(--border)',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,.4)',
        }}
      >
        <div className="flex items-center justify-between" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 className="section-title">{title}</h2>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-3)', fontSize: 24, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>{message}</p>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="button" onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

export function Drawer({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div
        className="relative h-full overflow-auto"
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--surface)',
          boxShadow: '-20px 0 60px -20px rgba(0,0,0,.3)',
          animation: 'ccslide 0.22s ease',
        }}
      >
        <div className="flex items-center justify-between sticky top-0" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <h2 className="section-title">{title}</h2>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-3)', fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
      </div>
    </div>
  );
}
