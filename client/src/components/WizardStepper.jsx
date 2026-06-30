export default function WizardStepper({ steps, currentStep }) {
  return (
    <div className="flex items-center mb-8" style={{ gap: 8 }}>
      {steps.map((step, idx) => {
        const num = idx + 1;
        const done = num < currentStep;
        const active = num === currentStep;
        return (
          <div key={step} className="flex items-center flex-1" style={{ gap: 8 }}>
            <div
              className="flex items-center justify-center shrink-0 font-bold"
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                fontSize: 13,
                background: done || active ? 'var(--accent)' : 'var(--surface-2)',
                color: done || active ? '#fff' : 'var(--text-3)',
                boxShadow: active ? '0 0 0 3px var(--accent-soft)' : 'none',
              }}
            >
              {done ? '✓' : num}
            </div>
            <span
              className="hidden sm:block"
              style={{
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--text)' : 'var(--text-3)',
              }}
            >
              {step}
            </span>
            {idx < steps.length - 1 && (
              <div
                className="flex-1"
                style={{
                  height: 2,
                  borderRadius: 1,
                  background: done ? 'var(--accent)' : 'var(--border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
