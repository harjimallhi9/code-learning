import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import MapView from '../../components/Map/MapView.jsx';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import TelemetryPanel from '../../components/TelemetryPanel/TelemetryPanel.jsx';
import ShareLink from '../../components/ShareLink/ShareLink.jsx';
import { useSocket } from '../../hooks/useSocket.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { getOwnerToken } from '../../hooks/useSession.js';
import { api } from '../../services/api.js';
import './Session.css';

export default function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const ownerToken = getOwnerToken(sessionId);
  const countdown = useCountdown(session?.expiresAt);

  useEffect(() => {
    if (!ownerToken) {
      setError('This session is not linked to this browser.');
      return;
    }

    api.getOwnerSession(ownerToken).then(setSession).catch((e) => setError(e.message));

    socket.emit('owner:join', { ownerToken });
    const onState = (state) => setSession((prev) => ({ ...prev, ...state }));
    socket.on('session:state', onState);
    socket.on('error:auth', setError);

    return () => {
      socket.off('session:state', onState);
      socket.off('error:auth', setError);
    };
  }, [ownerToken, socket]);

  const stopSession = () => {
    socket.emit('owner:stop', { ownerToken });
  };

  if (error) {
    return (
      <AppShell>
        <div className="session-error glass">
          <p>{error}</p>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <div className="session-error glass"><p>Loading session…</p></div>
      </AppShell>
    );
  }

  const shareUrl = session.shareToken ? `${window.location.origin}/share/${session.shareToken}` : null;

  return (
    <AppShell>
      <div className="session-view">
        <aside className="session-panel">
          <div className="session-panel-head">
            <h2>{session.label}</h2>
            <StatusBadge status={session.status} />
          </div>
          <div className="mono session-countdown">{countdown}</div>

          <TelemetryPanel location={session.lastLocation} lastSeenAt={session.lastSeenAt} />

          {shareUrl && (
            <div className="session-share glass">
              <span className="session-share-label mono">SHARE LINK</span>
              <ShareLink url={shareUrl} />
            </div>
          )}

          <div className="session-actions">
            <button className="btn-ghost" onClick={() => navigate(`/history/${sessionId}`)}>View History</button>
            <button className="btn-danger" onClick={stopSession}>Stop Session</button>
          </div>
        </aside>
        <section className="session-map">
          <MapView location={session.lastLocation} />
        </section>
      </div>
    </AppShell>
  );
}
