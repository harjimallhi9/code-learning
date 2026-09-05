const STORAGE_KEY = 'nomad_owner_sessions'; // { sessionId: ownerToken }

// Small localStorage-backed helper for tracking which sessions THIS browser
// owns. The server never trusts this list for authorization - it's purely a
// client convenience for "which owner_tokens do I have" so the dashboard
// knows what to fetch.
export function saveOwnedSession(sessionId, ownerToken) {
  const map = getOwnedSessions();
  map[sessionId] = ownerToken;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getOwnedSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getOwnerTokens() {
  return Object.values(getOwnedSessions());
}

export function getOwnerToken(sessionId) {
  return getOwnedSessions()[sessionId];
}

export function removeOwnedSession(sessionId) {
  const map = getOwnedSessions();
  delete map[sessionId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
