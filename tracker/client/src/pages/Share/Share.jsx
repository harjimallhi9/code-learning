import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import ConsentScreen from '../../components/ConsentScreen/ConsentScreen.jsx';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import { useSocket } from '../../hooks/useSocket.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { api } from '../../services/api.js';
import './Share.css';

export default function Share() {
  const { shareToken } = useParams();
  const socket = useSocket();
  const [session, setSession] = useState(null);
  const [phase, setPhase] = useState('loading'); // loading | consent | sharing | declined | error
  const [error, setError] = useState(null);
  const [lastSent, setLastSent] = useState(null);

  const handleLocation = useCallback((coords) => {
    setLastSent(new Date());
    socket.emit('recipient:location', { shareToken, ...coords });
  }, [shareToken, socket]);

  const geo = useGeolocation(handleLocation);

  useEffect(() => {
    api.getShareSession(shareToken)
      .then((s) => { setSession(s); setPhase('consent'); })
      .catch((e) => { setError(e.message); setPhase('error'); });

    socket.emit('recipient:join', { shareToken });
    socket.on('error:auth', (msg) => { setError(msg); setPhase('error'); });

    return () => socket.off('error:auth');
  }, [shareToken, socket]);

  const accept = () => {
    setPhase('sharing');
    geo.start();
  };

  const decline = () => {
    socket.emit('recipient:status', { shareToken, status: 'declined' });
    geo.stop();
    setPhase('declined');
  };

  const stopSharing = () => {
    geo.stop();
    socket.emit('recipient:status', { shareToken, status: 'stopped' });
    setPhase('declined');
  };

  return (
    <AppShell>
      {phase === 'loading' && <div className="share-status glass"><p>Loading request…</p></div>}

      {phase === 'error' && (
        <div className="share-status glass"><p>{error}</p></div>
      )}

      {phase === 'consent' && (
        <ConsentScreen label={session?.label} onAccept={accept} onDecline={decline} />
      )}

      {phase === 'declined' && (
        <div className="share-status glass">
          <StatusBadge status="stopped" />
          <p>Location sharing has stopped. You can close this page.</p>
        </div>
      )}

      {phase === 'sharing' && (
        <div className="share-active glass">
          <div className="share-active-icon">◉</div>
          <StatusBadge status="sharing" />
          <h2>Location sharing active</h2>
          <p>Your location is currently being shared{session?.label ? ` with ${session.label}` : ''}.</p>
          {geo.error && <p className="share-error">{geo.error}</p>}
          <p className="mono share-last-sent">
            {lastSent ? `Last update: ${lastSent.toLocaleTimeString()}` : 'Waiting for GPS fix…'}
          </p>
          <button className="btn-danger" onClick={stopSharing}>Stop Sharing</button>
        </div>
      )}
    </AppShell>
  );
}
