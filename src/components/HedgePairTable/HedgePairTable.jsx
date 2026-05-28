import React from 'react';

/**
 * Displays all existing Hedge Pairs in a table with a Delete button per row.
 */
export default function HedgePairTable({ pairs, loading, onDelete }) {
  if (loading && pairs.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading pairs…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
        <i className="bi bi-table" aria-hidden="true" />
        <strong>Existing Hedge Pairs</strong>
        <span className="badge bg-light text-primary ms-auto">
          {pairs.length} {pairs.length === 1 ? 'pair' : 'pairs'}
        </span>
      </div>

      <div className="card-body p-0">
        {pairs.length === 0 ? (
          <div className="text-center py-5 text-muted" data-testid="empty-pairs">
            <i className="bi bi-inbox fs-2 d-block mb-2" aria-hidden="true" />
            No Hedge Pairs exist yet. Create your first pair above.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0" data-testid="pairs-table">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Bond Deal No.</th>
                  <th scope="col" className="text-end">Bond Notional</th>
                  <th scope="col">Swap Deal No.</th>
                  <th scope="col" className="text-end">Swap Notional</th>
                  <th scope="col" className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(pair => (
                  <tr key={pair.hedgePairId} data-testid={`pair-row-${pair.hedgePairId}`}>
                    <td className="fw-bold text-muted small">{pair.hedgePairId}</td>

                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {pair.bondDealNumber}
                      </span>
                    </td>

                    <td className="text-end font-monospace">
                      {formatAmt(pair.bondNotionalAmt)}
                    </td>

                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        {pair.swapDealNumber}
                      </span>
                    </td>

                    <td className="text-end font-monospace">
                      {formatAmt(pair.swapNotionalAmt)}
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(pair.hedgePairId)}
                        disabled={loading}
                        data-testid={`delete-btn-${pair.hedgePairId}`}
                        title={`Delete Hedge Pair #${pair.hedgePairId}`}
                      >
                        <i className="bi bi-trash-fill me-1" aria-hidden="true" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
