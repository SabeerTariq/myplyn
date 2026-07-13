import Icon from '../Icon';
import '../../styles/wallet.css';

const PRESETS = [50, 100, 250, 500];

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function WithdrawCard({
  available = 0,
  amount,
  onAmountChange,
  onSubmit,
  loading = false,
  feedback = null,
}) {
  const numericAmount = parseFloat(amount) || 0;
  const hasAmount = numericAmount > 0;
  const canWithdraw = hasAmount && numericAmount <= available;

  const handlePreset = (preset) => {
    onAmountChange(String(Math.min(preset, available)));
  };

  return (
    <div className="wallet-withdraw-card">
      <div className="wallet-withdraw-card__header">
        <span className="wallet-withdraw-card__icon" aria-hidden="true">
          <Icon name="payments" size={22} />
        </span>
        <div>
          <h3 className="wallet-withdraw-card__title">Request payout</h3>
          <p className="wallet-withdraw-card__lead">
            Transfer available earnings to your connected payout account.
          </p>
        </div>
      </div>

      <form className="wallet-withdraw-card__form" onSubmit={onSubmit}>
        <div className="wallet-withdraw-card__available">
          <span>Available to withdraw</span>
          <strong>${formatMoney(available)}</strong>
        </div>

        {available > 0 && (
          <div className="wallet-withdraw-card__section">
            <span className="wallet-withdraw-card__label">Quick amounts</span>
            <div className="wallet-withdraw-card__presets" role="group" aria-label="Quick withdraw amounts">
              {PRESETS.map((preset) => {
                const active = String(amount) === String(preset);
                const disabled = loading || preset > available;
                return (
                  <button
                    key={preset}
                    type="button"
                    className={`wallet-withdraw-card__preset${active ? ' is-active' : ''}`}
                    onClick={() => handlePreset(preset)}
                    disabled={disabled}
                    aria-pressed={active}
                  >
                    ${preset.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="wallet-withdraw-card__section">
          <label className="wallet-withdraw-card__label" htmlFor="withdraw-amount">
            Payout amount
          </label>
          <div className="wallet-withdraw-card__amount-wrap">
            <span className="wallet-withdraw-card__currency" aria-hidden="true">$</span>
            <input
              id="withdraw-amount"
              type="number"
              min="1"
              max={available || undefined}
              step="0.01"
              inputMode="decimal"
              className="input wallet-withdraw-card__amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              disabled={loading || available <= 0}
              required
            />
          </div>
        </div>

        {feedback && (
          <div
            className={`wallet-withdraw-card__feedback wallet-withdraw-card__feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            <Icon name={feedback.type === 'success' ? 'check_circle' : 'error'} size={18} />
            <span>{feedback.text}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary wallet-withdraw-card__submit"
          disabled={loading || !canWithdraw || available <= 0}
        >
          {loading ? (
            <>
              <span className="wallet-fund-card__spinner" aria-hidden="true" />
              Processing…
            </>
          ) : (
            <>
              <Icon name="south_west" size={18} />
              Request payout
            </>
          )}
        </button>

        {available <= 0 && (
          <p className="wallet-withdraw-card__note">
            No available balance yet. Earnings appear here after collaborations are paid out.
          </p>
        )}
      </form>
    </div>
  );
}
