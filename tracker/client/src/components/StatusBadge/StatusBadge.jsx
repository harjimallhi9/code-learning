import './StatusBadge.css';

const STATUS_META = {
  waiting:    { label: 'Waiting',   color: 'var(--text-muted)' },
  connected:  { label: 'Connected', color: 'var(--accent-blue)' },
  sharing:    { label: 'Live',      color: 'var(--accent-green)', pulse: true },
  paused:     { label: 'Paused',    color: 'var(--accent-amber)' },
  stopped:    { label: 'Stopped',   color: 'var(--text-muted)' },
  declined:   { label: 'Declined',  color: 'var(--accent-red)' },
  offline:    { label: 'Offline',   color: 'var(--text-muted)' },
  expired:    { label: 'Expired',   color: 'var(--text-muted)' },
};

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.waiting;
  return (
    <span className="status-badge">
      <span
        className={`status-dot ${meta.pulse ? 'status-dot--pulse' : ''}`}
        style={{ background: meta.color }}
      />
      <span className="mono" style={{ color: meta.color }}>{meta.label.toUpperCase()}</span>
    </span>
  );
}
