import { queries } from '../db.js';

// Server-side sweep for links left open past their configured duration.
// Runs on an interval rather than relying on the client to say "I expired" -
// the client's clock and intent are never trusted for state transitions.
export function startExpirySweeper(io, intervalMs = 30_000) {
  setInterval(() => {
    const result = queries.expireStale.run();
    if (result.changes > 0) {
      // We don't know which specific sessions flipped without a follow-up
      // query; for the scale this app runs at, notifying affected rooms is
      // done by having clients simply re-fetch on their own poll/heartbeat,
      // or by extending this to SELECT the ids first if you want push updates.
    }
  }, intervalMs);
}
