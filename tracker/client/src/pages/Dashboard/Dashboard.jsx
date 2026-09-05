import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import SessionCard from '../../components/SessionCard/SessionCard.jsx';
import MapView from '../../components/Map/MapView.jsx';
import { api } from '../../services/api.js';
import { getOwnerTokens } from '../../hooks/useSession.js';
import './Dashboard.css';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = getOwnerTokens();
    if (!tokens.length) {
      setLoading(false);
      return;
    }
    api.getMySessions(tokens)
      .then((list) => {
        setSessions(list);
        setSelected(list.find((s) => s.status === 'sharing') || list[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="dashboard">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-head">
            <h3>Sessions</h3>
            <Link to="/create" className="btn-primary dashboard-new">+ New</Link>
          </div>
          <div className="dashboard-list">
            {loading && <p>Loading…</p>}
            {!loading && !sessions.length && (
              <p className="dashboard-empty">No sessions yet. Create your first tracking link.</p>
            )}
            {sessions.map((s) => (
              <SessionCard
                key={s.sessionId}
                session={s}
                selected={selected?.sessionId === s.sessionId}
                onSelect={setSelected}
              />
            ))}
          </div>
        </aside>
        <section className="dashboard-map">
          <MapView location={selected?.lastLocation} />
        </section>
      </div>
    </AppShell>
  );
}
