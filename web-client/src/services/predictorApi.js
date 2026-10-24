import axios from 'axios';

// One place for the Flask address (override with VITE_API_BASE_URL in .env).
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5092').replace(/\/+$/, '');

// An error that carries the message Flask put in its JSON body.
export class BackendError extends Error {
  constructor(message, backendMessage = null) {
    super(message);
    this.name = 'BackendError';
    this.backendMessage = backendMessage;
  }
}

// GET /api/locations -> { success, locations: [...] }
export async function getLocations() {
  const { data } = await axios.get(`${API_BASE}/api/locations`);
  if (!data?.success || !Array.isArray(data.locations)) {
    throw new BackendError('Unexpected response from /api/locations');
  }
  return data.locations;
}

// POST /api/predict with the 16 form fields exactly as the form holds them.
// Response: { success, predicted_price_usd, price_per_sqm_usd, location, total_area_m2 }
export async function predictPrice(formData) {
  const { data } = await axios.post(`${API_BASE}/api/predict`, formData);

  if (!data?.success) {
    throw new BackendError('Prediction rejected', data?.error ?? null);
  }

  const priceUsd = Number(data.predicted_price_usd);
  const pricePerSqmUsd = Number(data.price_per_sqm_usd);
  if (!Number.isFinite(priceUsd) || !Number.isFinite(pricePerSqmUsd)) {
    console.error('[predict] Missing predicted_price_usd / price_per_sqm_usd in response:', data);
    throw new BackendError('Malformed prediction response');
  }

  return {
    priceUsd,
    pricePerSqmUsd,
    location: data.location,
    totalAreaM2: data.total_area_m2,
  };
}

// The message Flask sent (e.g. a 400 validation error), or null if none.
export function getBackendErrorMessage(error) {
  return error?.backendMessage ?? error?.response?.data?.error ?? null;
}
