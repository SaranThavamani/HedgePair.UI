import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useHedgePairs } from './hooks/useHedgePairs';
import HedgePairForm  from './components/HedgePairForm/HedgePairForm';
import HedgePairTable from './components/HedgePairTable/HedgePairTable';

export default function App() {
  const {
    bonds, swaps, pairs, loading,
    error, setError,
    success, setSuccess,
    selectedBondId, setSelectedBondId,
    selectedSwapId, setSelectedSwapId,
    selectedBond, selectedSwap,
    handleCreate, handleDelete, handleCancel,
  } = useHedgePairs();

  return (
    <div className="min-vh-100 bg-light">
      {/* ── Top Navigation ── */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <i className="bi bi-bar-chart-line-fill fs-4" aria-hidden="true" />
            <span className="fw-bold">Hedge Pair Management System</span>
          </span>
          <span className="navbar-text text-white-50 small">
            React.js · .NET 8 · Azure SQL
          </span>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="h4 fw-bold text-dark mb-1">
              Hedge Pair Lifecycle Management
            </h1>
            <p className="text-muted small mb-0">
              Create, view, and delete Bond–Swap Hedge Pairs. Notional Amounts must match to create a pair.
            </p>
          </div>
        </div>

        {/* ── Create Form ── */}
        <HedgePairForm
          bonds={bonds}
          swaps={swaps}
          selectedBondId={selectedBondId}
          selectedSwapId={selectedSwapId}
          selectedBond={selectedBond}
          selectedSwap={selectedSwap}
          error={error}
          success={success}
          loading={loading}
          onBondChange={setSelectedBondId}
          onSwapChange={setSelectedSwapId}
          onCreate={handleCreate}
          onCancel={handleCancel}
          onDismissError={() => setError('')}
          onDismissSuccess={() => setSuccess('')}
        />

        {/* ── Pairs Table ── */}
        <HedgePairTable
          pairs={pairs}
          loading={loading}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-3 mt-4 border-top bg-white">
        <small className="text-muted">
          Hedge Pair Management System 
        </small>
      </footer>
    </div>
  );
} 
