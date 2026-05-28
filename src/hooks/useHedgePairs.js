import { useState, useEffect, useCallback } from 'react';
import {
  getActiveInstruments,
  getAllPairs,
  createPair,
  deletePair,
} from '../services/hedgePairService';

/**
 * Custom hook encapsulating all Hedge Pair state and API calls.
 * Keeps components thin — they only handle rendering.
 */
export function useHedgePairs() {
  const [instruments, setInstruments] = useState([]);  // all active unpaired
  const [pairs,       setPairs]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  // ── Selection state ────────────────────────────────────────────────────────
  const [selectedBondId, setSelectedBondId] = useState('');
  const [selectedSwapId, setSelectedSwapId] = useState('');

  const bonds = instruments.filter(fi => fi.dealType === 'BOND');
  const swaps = instruments.filter(fi => fi.dealType === 'SWAP');

  const selectedBond = bonds.find(b => b.finId === Number(selectedBondId)) || null;
  const selectedSwap = swaps.find(s => s.finId === Number(selectedSwapId)) || null;

  // ── Data loading ───────────────────────────────────────────────────────────

  const loadInstruments = useCallback(async () => {
    const data = await getActiveInstruments();
    setInstruments(data);
  }, []);

  const loadPairs = useCallback(async () => {
    const data = await getAllPairs();
    setPairs(data);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadInstruments(), loadPairs()]);
  }, [loadInstruments, loadPairs]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await refreshAll();
      } catch {
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshAll]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleCreate = useCallback(async () => {
    setError('');
    setSuccess('');

    if (!selectedBondId || !selectedSwapId) {
      setError('Please select both a Bond and a Swap.');
      return;
    }

    // Client-side notional validation
    if (selectedBond && selectedSwap &&
        selectedBond.notionalAmt !== selectedSwap.notionalAmt) {
      setError(
        `Selected Values does not match the required amount. ` +
        `Bond: ${formatAmt(selectedBond.notionalAmt)} ≠ Swap: ${formatAmt(selectedSwap.notionalAmt)}`
      );
      return;
    }

    setLoading(true);
    try {
      await createPair(Number(selectedBondId), Number(selectedSwapId));
      setSuccess('Hedge Pair created successfully.');
      setSelectedBondId('');
      setSelectedSwapId('');
      await refreshAll();
    } catch (err) {
      const msg = err?.response?.data?.message ||
                  err?.response?.data?.detail  ||
                  err?.response?.data          ||
                  'Failed to create Hedge Pair.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }, [selectedBondId, selectedSwapId, selectedBond, selectedSwap, refreshAll]);

  const handleDelete = useCallback(async (hedgePairId) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await deletePair(hedgePairId);
      setSuccess(`Hedge Pair #${hedgePairId} deleted. Instruments returned to pool.`);
      await refreshAll();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete Hedge Pair.');
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  const handleCancel = useCallback(() => {
    setSelectedBondId('');
    setSelectedSwapId('');
    setError('');
    setSuccess('');
  }, []);

  return {
    bonds, swaps, pairs, loading,
    error, setError,
    success, setSuccess,
    selectedBondId, setSelectedBondId,
    selectedSwapId, setSelectedSwapId,
    selectedBond, selectedSwap,
    handleCreate, handleDelete, handleCancel,
  };
}

function formatAmt(amt) {
  return Number(amt).toLocaleString('en-US', { minimumFractionDigits: 2 });
}
