import { Router } from 'express';
import { queries } from '../db.js';
import { generateToken } from '../services/token.js';

export const sessionsRouter = Router();

const DURATION_OPTIONS = {
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  'manual': null,
};

// POST /api/sessions  { label, duration }  -> { sessionId, ownerToken, shareToken, expiresAt }
sessionsRouter.post('/', (req, res) => {
  const label = String(req.body?.label || 'Untitled').trim().slice(0, 60) || 'Untitled';
  const durationKey = req.body?.duration in DURATION_OPTIONS ? req.body.duration : '1h';
  const durationMs = DURATION_OPTIONS[durationKey];

  const id = generateToken();
  const ownerToken = generateToken();
  const shareToken = generateToken();
  const expiresAt = durationMs ? new Date(Date.now() + durationMs).toISOString() : null;

  queries.insertSession.run({
    id, ownerToken, shareToken, label, durationMs, expiresAt,
  });

  res.status(201).json({ sessionId: id, ownerToken, shareToken, label, expiresAt });
});

// GET /api/sessions/mine  (owner_token(s) passed as ?tokens=a,b,c from localStorage)
// This is a convenience list endpoint - it never accepts a session id directly,
// only tokens the caller's browser already holds.
sessionsRouter.get('/mine', (req, res) => {
  const tokens = String(req.query.tokens || '').split(',').filter(Boolean);
  const sessions = queries.listByOwnerTokens(tokens).map(publicOwnerView);
  res.json(sessions);
});

// GET /api/sessions/owner/:ownerToken -> single session, owner's view
sessionsRouter.get('/owner/:ownerToken', (req, res) => {
  const session = queries.getByOwnerToken.get(req.params.ownerToken);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(publicOwnerView(session));
});

// GET /api/sessions/share/:shareToken -> recipient's view (no owner data leaked)
sessionsRouter.get('/share/:shareToken', (req, res) => {
  const session = queries.getByShareToken.get(req.params.shareToken);
  if (!session) return res.status(404).json({ error: 'Link not found or expired' });
  if (isExpired(session)) return res.status(410).json({ error: 'This link has expired' });

  queries.markOpened.run(session.id);

  res.json({
    sessionId: session.id,
    label: session.label,
    status: session.status,
    expiresAt: session.expires_at,
  });
});

// GET /api/sessions/:sessionId/history  -- gated by owner_token query param
sessionsRouter.get('/:sessionId/history', (req, res) => {
  const session = queries.getById.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.owner_token !== req.query.ownerToken) {
    return res.status(403).json({ error: 'Not authorized to view this session' });
  }
  res.json(queries.historyForSession.all(session.id));
});

function publicOwnerView(session) {
  return {
    sessionId: session.id,
    label: session.label,
    status: isExpired(session) ? 'expired' : session.status,
    expiresAt: session.expires_at,
    openedAt: session.opened_at,
    lastSeenAt: session.last_seen_at,
    shareToken: session.share_token, // only ever returned to the owner
  };
}

function isExpired(session) {
  return session.expires_at && new Date(session.expires_at) < new Date();
}
