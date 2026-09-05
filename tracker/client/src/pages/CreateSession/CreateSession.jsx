import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import ShareLink from '../../components/ShareLink/ShareLink.jsx';
import { api } from '../../services/api.js';
import { saveOwnedSession } from '../../hooks/useSession.js';
import './CreateSession.css';

const DURATIONS = [
  { value: '15m', label: '15 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: 'manual', label: 'Until manually stopped' },
];

export default function CreateSession() {
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState('1h');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await api.createSession(label || 'Untitled', duration);
      saveOwnedSession(session.sessionId, session.ownerToken);
      setResult(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = result ? `${window.location.origin}/share/${result.shareToken}` : '';

  return (
    <AppShell>
      <div className="create-session">
        {!result ? (
          <div className="glass create-card">
            <h2>Create session</h2>
            <p className="create-sub">Who are you sharing with?</p>
            <div className="field">
              <label>Name</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Mom"
                maxLength={60}
              />
            </div>
            <div className="field">
              <label>Link duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            {error && <p className="create-error">{error}</p>}
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Generating…' : 'Generate Link'}
            </button>
          </div>
        ) : (
          <div className="glass create-card">
            <span className="create-eyebrow mono">LINK READY</span>
            <h2>Your link is ready</h2>
            <ShareLink url={shareUrl} />
            <button className="btn-ghost" onClick={() => navigate(`/session/${result.sessionId}`)}>
              View live session →
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
