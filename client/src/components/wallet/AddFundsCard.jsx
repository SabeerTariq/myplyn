import Icon from '../Icon';
import '../../styles/wallet.css';

const PRESETS = [100, 500, 1000, 2500];

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function AddFundsCard({
  currentBalance = 0,
  amount,
  onAmountChange,
  onSubmit,
  loading = false,
  feedback = null,
  compact = false,
  submitLabel = 'Add funds',
}) {
  const numericAmount = parseFloat(amount) || 0;
  const hasAmount = numericAmount > 0;
  const projectedBalance = currentBalance + numericAmount;

  const handlePreset = (preset) => {
    onAmountChange(String(preset));
  };

  return (
    <div className={`wallet-fund-card${compact ? ' wallet-fund-card--compact' : ''}`}>
      {!compact && (
        <div className="wallet-fund-card__header">
          <span className="wallet-fund-card__icon" aria-hidden="true">
            <Icon name="add_card" size={22} />
          </span>
          <div>
            <h3 className="wallet-fund-card__title">Add funds</h3>
            <p className="wallet-fund-card__lead">
              Top up your wallet to hold budget when you accept creator proposals.
            </p>
          </div>
        </div>
      )}

      <form className="wallet-fund-card__form" onSubmit={onSubmit}>
        <div className="wallet-fund-card__section">
          <span className="wallet-fund-card__label">Quick amounts</span>
          <div className="wallet-fund-card__presets" role="group" aria-label="Quick fund amounts">
            {PRESETS.map((preset) => {
              const active = String(amount) === String(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  className={`wallet-fund-card__preset${active ? ' is-active' : ''}`}
                  onClick={() => handlePreset(preset)}
                  disabled={loading}
                  aria-pressed={active}
                >
                  ${preset.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="wallet-fund-card__section">
          <label className="wallet-fund-card__label" htmlFor={compact ? 'fund-amount-modal' : 'fund-amount'}>
            Custom amount
          </label>
          <div className="wallet-fund-card__amount-wrap">
            <span className="wallet-fund-card__currency" aria-hidden="true">$</span>
            <input
              id={compact ? 'fund-amount-modal' : 'fund-amount'}
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              className="input wallet-fund-card__amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* <div className="wallet-fund-card__summary" aria-live="polite">
          <div className="wallet-fund-card__summary-item">
            <span>Available now</span>
            <strong>${formatMoney(currentBalance)}</strong>
          </div>
          <div className="wallet-fund-card__summary-item">
            <span>After top-up</span>
            <strong className={hasAmount ? 'is-highlight' : ''}>
              ${formatMoney(hasAmount ? projectedBalance : currentBalance)}
            </strong>
          </div>
        </div> */}

        {feedback && (
          <div
            className={`wallet-fund-card__feedback wallet-fund-card__feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            <Icon name={feedback.type === 'success' ? 'check_circle' : 'error'} size={18} />
            <span>{feedback.text}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary wallet-fund-card__submit"
          disabled={loading || !hasAmount}
        >
          {loading ? (
            <>
              <span className="wallet-fund-card__spinner" aria-hidden="true" />
              Processing…
            </>
          ) : (
            <>
              <Icon name="account_balance_wallet" size={18} />
              {submitLabel}
            </>
          )}
        </button>

        <p className="wallet-fund-card__note">
          Funds are added instantly in demo mode. Live Stripe checkout will replace this flow.
        </p>
      </form>
    </div>
  );
}
