import React from 'react';
import ValidationAlert from '../common/ValidationAlert';

/**
 * Bond + Swap selection form with notional display and Pair/Cancel buttons.
 */
export default function HedgePairForm({
  bonds,
  swaps,
  selectedBondId,
  selectedSwapId,
  selectedBond,
  selectedSwap,
  error,
  success,
  loading,
  onBondChange,
  onSwapChange,
  onCreate,
  onCancel,
  onDismissError,
  onDismissSuccess,
}) {
  const notionalMismatch =
    selectedBond && selectedSwap &&
    selectedBond.notionalAmt !== selectedSwap.notionalAmt;

  const canPair =
    selectedBondId && selectedSwapId && !notionalMismatch && !loading;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
        <i className="bi bi-plus-circle-fill" aria-hidden="true" />
        <strong>Create Hedge Pair</strong>
      </div>

      <div className="card-body">
        {/* Success */}
        {success && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
            data-testid="success-alert"
          >
            <i className="bi bi-check-circle-fill me-2" />
            {success}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onDismissSuccess}
            />
          </div>
        )}

        {/* Validation error */}
        <ValidationAlert message={error} onDismiss={onDismissError} />

        <div className="row g-3">
          {/* Bond Dropdown */}
          <div className="col-md-5">
            <label htmlFor="bond-select" className="form-label fw-semibold">
              Bond
            </label>
            <select
              id="bond-select"
              className="form-select"
              value={selectedBondId}
              onChange={e => onBondChange(e.target.value)}
              disabled={loading}
              data-testid="bond-select"
            >
              <option value="">-- Select Bond --</option>
              {bonds.map(b => (
                <option key={b.finId} value={b.finId}>
                  {b.dealNumber}
                </option>
              ))}
            </select>

            {selectedBond && (
              <div
                className="mt-2 p-2 rounded bg-light border text-sm"
                data-testid="bond-notional"
              >
                <span className="text-muted">Notional Amount: </span>
                <strong className="text-dark">
                  {formatAmt(selectedBond.notionalAmt)}
                </strong>
              </div>
            )}
          </div>

          {/* Swap Dropdown */}
          <div className="col-md-5">
            <label htmlFor="swap-select" className="form-label fw-semibold">
              Swap
            </label>
            <select
              id="swap-select"
              className="form-select"
              value={selectedSwapId}
              onChange={e => onSwapChange(e.target.value)}
              disabled={loading}
              data-testid="swap-select"
            >
              <option value="">-- Select Swap --</option>
              {swaps.map(sw => (
                <option key={sw.finId} value={sw.finId}>
                  {sw.dealNumber}
                </option>
              ))}
            </select>

            {selectedSwap && (
              <div
                className={`mt-2 p-2 rounded border text-sm ${
                  notionalMismatch ? 'bg-danger bg-opacity-10 border-danger' : 'bg-light'
                }`}
                data-testid="swap-notional"
              >
                <span className="text-muted">Notional Amount: </span>
                <strong className={notionalMismatch ? 'text-danger' : 'text-dark'}>
                  {formatAmt(selectedSwap.notionalAmt)}
                </strong>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button
              className="btn btn-success flex-fill"
              onClick={onCreate}
              disabled={!canPair}
              data-testid="pair-button"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : (
                <i className="bi bi-link-45deg me-1" aria-hidden="true" />
              )}
              Pair
            </button>

            <button
              className="btn btn-outline-secondary flex-fill"
              onClick={onCancel}
              disabled={loading}
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Mismatch inline hint */}
        {notionalMismatch && (
          <div
            className="alert alert-warning mt-3 mb-0 py-2"
            role="alert"
            data-testid="mismatch-hint"
          >
            <i className="bi bi-exclamation-triangle me-2" />
            Selected Values does not match the required amount. Bond and Swap Notional Amounts must be equal.
          </div>
        )}
      </div>
    </div>
  );
}

function formatAmt(amt) {
  return Number(amt).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}
