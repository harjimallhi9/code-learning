const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  createSession: (label, duration) =>
    request('/api/sessions', { method: 'POST', body: JSON.stringify({ label, duration }) }),

  getMySessions: (ownerTokens) =>
    request(`/api/sessions/mine?tokens=${ownerTokens.join(',')}`),

  getOwnerSession: (ownerToken) =>
    request(`/api/sessions/owner/${ownerToken}`),

  getShareSession: (shareToken) =>
    request(`/api/sessions/share/${shareToken}`),

  getHistory: (sessionId, ownerToken) =>
    request(`/api/sessions/${sessionId}/history?ownerToken=${ownerToken}`),
};
