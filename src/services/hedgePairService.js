import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} FinancialInstrument
 * @property {number} finId
 * @property {string} dealNumber
 * @property {number} notionalAmt
 * @property {string} dealType   - "BOND" | "SWAP"
 * @property {string} dealStatus - "Active" | "Inactive"
 */

/**
 * @typedef {Object} HedgePair
 * @property {number} hedgePairId
 * @property {number} bondFinId
 * @property {string} bondDealNumber
 * @property {number} bondNotionalAmt
 * @property {number} swapFinId
 * @property {string} swapDealNumber
 * @property {number} swapNotionalAmt
 */

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Fetches all Active unpaired Financial Instruments (Bonds + Swaps).
 * @returns {Promise<FinancialInstrument[]>}
 */
export async function getActiveInstruments() {
  const { data } = await api.get('/api/financial-instrument/active-fins');
  return data;
}

/**
 * Fetches all existing Hedge Pairs.
 * @returns {Promise<HedgePair[]>}
 */
export async function getAllPairs() {
  const { data } = await api.get('/api/pairing/all');
  return data;
}

/**
 * Creates a new Hedge Pair.
 * @param {number} bondFinId
 * @param {number} swapFinId
 * @returns {Promise<HedgePair>}
 */
export async function createPair(bondFinId, swapFinId) {
  const { data } = await api.post('/api/pairing', { bondFinId, swapFinId });
  return data;
}

/**
 * Deletes a Hedge Pair by its ID.
 * @param {number} hedgePairId
 * @returns {Promise<void>}
 */
export async function deletePair(hedgePairId) {
  await api.delete(`/api/pairing/${hedgePairId}`);
}

export default api;
