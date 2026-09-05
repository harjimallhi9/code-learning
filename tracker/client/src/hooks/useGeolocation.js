import { useCallback, useRef, useState } from 'react';

// Wraps navigator.geolocation.watchPosition. Never starts on its own -
// the caller must invoke start() from a real user interaction (a click),
// which is what actually triggers the browser's native permission prompt.
export function useGeolocation(onUpdate) {
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const watchIdRef = useRef(null);

  const start = useCallback(() => {
    if (!window.isSecureContext) {
      setError('Location requires a secure (HTTPS) connection.');
      return;
    }
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setActive(true);
        onUpdate({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        const messages = {
          1: 'Location permission denied.',
          2: 'Position unavailable right now.',
          3: 'Location request timed out.',
        };
        setError(messages[err.code] || err.message);
        setActive(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  }, [onUpdate]);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setActive(false);
  }, []);

  return { start, stop, active, error };
}
