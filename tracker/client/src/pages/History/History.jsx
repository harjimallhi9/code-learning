import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import MapView from '../../components/Map/MapView.jsx';
import { api } from '../../services/api.js';
import { getOwnerToken } from '../../hooks/useSession.js';
import './History.css';

export default function History() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [error, setError] = useState(null);
  const ownerToken = getOwnerToken(sessionId);

  useEffect(() => {
    if (!ownerToken) return setError('This session is not linked to this browser.');
    api.getHistory(sessionId, ownerToken).then(setPoints).catch((e) => setError(e.message));
  }, [sessionId, ownerToken]);

  const last = points[points.length - 1];

  return (
    <AppShell>
      <div className="history-view">
        <aside className="history-panel">
          <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <h2>Route history</h2>
          {error && <p className="history-error">{error}</p>}
          <div className="history-stats">
            <div><span className="mono">{points.length}</span><small>Updates</small></div>
            <div><span className="mono">{points[0] ? new Date(points[0].created_at).toLocaleTimeString() : '—'}</span><small>Start</small></div>
            <div><span className="mono">{last ? new Date(last.created_at).toLocaleTimeString() : '—'}</span><small>Last</small></div>
          </div>
        </aside>
        <section className="history-map">
          <MapView location={last ? { lat: last.lat, lng: last.lng, accuracy: last.accuracy } : null} trail={points} />
        </section>
      </div>
    </AppShell>
  );
}
