import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge.jsx';
import { formatCountdown } from '../../utils/time.js';
import './SessionCard.css';

export default function SessionCard({ session, selected, onSelect }) {
  return (
    <div
      className={`session-card ${selected ? 'session-card--selected' : ''}`}
      onClick={() => onSelect?.(session)}
    >
      <div className="session-card-top">
        <span className="session-card-label">{session.label}</span>
        <StatusBadge status={session.status} />
      </div>
      <div className="session-card-meta mono">{formatCountdown(session.expiresAt)}</div>
      <Link to={`/session/${session.sessionId}`} className="session-card-link" onClick={(e) => e.stopPropagation()}>
        Open →
      </Link>
    </div>
  );
}
