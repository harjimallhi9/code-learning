import { useEffect, useState } from 'react';
import { formatCountdown } from '../utils/time.js';

export function useCountdown(expiresAt) {
  const [label, setLabel] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    setLabel(formatCountdown(expiresAt));
    if (!expiresAt) return;
    const id = setInterval(() => setLabel(formatCountdown(expiresAt)), 30_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return label;
}
