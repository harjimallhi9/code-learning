import { useEffect } from 'react';
import { socket } from '../services/socket.js';

// Connects the shared socket on mount and disconnects on final unmount.
// Individual pages still emit their own join events (owner:join /
// recipient:join) since the room they need depends on their own token.
export function useSocket() {
  useEffect(() => {
    if (!socket.connected) socket.connect();
    return () => {
      // Intentionally not disconnecting here - other mounted components
      // (e.g. dashboard + a nested map) may still rely on the same socket.
      // Actual teardown is handled by the browser tab closing / navigating away.
    };
  }, []);

  return socket;
}
