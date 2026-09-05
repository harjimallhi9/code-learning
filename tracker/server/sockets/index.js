import { queries } from '../db.js';

const VALID_STATUSES_FROM_RECIPIENT = new Set(['sharing', 'paused', 'stopped', 'declined']);

// Every event here re-validates the token against the DB. Nothing is trusted
// from a previous event in the same socket session beyond the token it
// registered with - that's what stops one session's data from leaking into
// another's room by guessing an id.
export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    // Owner's dashboard/session view joins with their private owner_token.
    socket.on('owner:join', ({ ownerToken }) => {
      const session = queries.getByOwnerToken.get(ownerToken);
      if (!session) return socket.emit('error:auth', 'Invalid session.');

      socket.data.role = 'owner';
      socket.data.sessionId = session.id;
      socket.join(roomFor(session.id));

      const latest = queries.latestLocation.get(session.id);
      socket.emit('session:state', toClientSession(session, latest));
    });

    // Recipient's share page joins with the public share_token.
    socket.on('recipient:join', ({ shareToken }) => {
      const session = queries.getByShareToken.get(shareToken);
      if (!session) return socket.emit('error:auth', 'This link is invalid or expired.');
      if (isExpired(session)) return socket.emit('error:auth', 'This link has expired.');

      socket.data.role = 'recipient';
      socket.data.sessionId = session.id;
      socket.data.shareToken = shareToken;
      socket.join(roomFor(session.id));

      if (session.status === 'waiting') {
        queries.setStatus.run('connected', session.id);
      }
      broadcastState(io, session.id);
    });

    // Recipient explicitly consents and begins streaming.
    socket.on('recipient:location', ({ shareToken, lat, lng, accuracy }) => {
      if (socket.data.role !== 'recipient' || socket.data.shareToken !== shareToken) {
        return socket.emit('error:auth', 'Not authorized to send location for this session.');
      }

      const session = queries.getById.get(socket.data.sessionId);
      if (!session || isExpired(session)) {
        return socket.emit('error:auth', 'This session is no longer active.');
      }

      lat = Number(lat);
      lng = Number(lng);
      accuracy = Number(accuracy) || 0;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        return; // silently drop malformed points
      }

      queries.insertLocation.run(session.id, lat, lng, accuracy);
      queries.touchLastSeen.run(session.id);
      if (session.status !== 'sharing') queries.setStatus.run('sharing', session.id);

      io.to(roomFor(session.id)).emit('location:update', {
        lat, lng, accuracy, timestamp: new Date().toISOString(),
      });
    });

    // Recipient changes their own state: paused / stopped / declined.
    socket.on('recipient:status', ({ shareToken, status }) => {
      if (socket.data.role !== 'recipient' || socket.data.shareToken !== shareToken) return;
      if (!VALID_STATUSES_FROM_RECIPIENT.has(status)) return;

      queries.setStatus.run(status, socket.data.sessionId);
      broadcastState(io, socket.data.sessionId);
    });

    // Owner can stop the session outright.
    socket.on('owner:stop', ({ ownerToken }) => {
      const session = queries.getByOwnerToken.get(ownerToken);
      if (!session || socket.data.sessionId !== session.id) return;

      queries.setStatus.run('stopped', session.id);
      broadcastState(io, session.id);
    });
  });
}

function roomFor(sessionId) {
  return `session:${sessionId}`;
}

function isExpired(session) {
  return session.expires_at && new Date(session.expires_at) < new Date();
}

function toClientSession(session, latest) {
  return {
    sessionId: session.id,
    label: session.label,
    status: isExpired(session) ? 'expired' : session.status,
    expiresAt: session.expires_at,
    lastLocation: latest || null,
  };
}

function broadcastState(io, sessionId) {
  const session = queries.getById.get(sessionId);
  if (!session) return;
  const latest = queries.latestLocation.get(sessionId);
  io.to(roomFor(sessionId)).emit('session:state', toClientSession(session, latest));
}
