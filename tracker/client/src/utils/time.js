export function timeAgo(isoString) {
  if (!isoString) return '—';
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function formatCountdown(expiresAt) {
  if (!expiresAt) return 'No expiry';
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `Expires in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `Expires in ${hours}h ${minutes % 60}m`;
}

export function formatCoord(value) {
  return typeof value === 'number' ? value.toFixed(6) : '—';
}
