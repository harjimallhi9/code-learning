import { formatCoord, timeAgo } from '../../utils/time.js';
import './TelemetryPanel.css';

export default function TelemetryPanel({ location, lastSeenAt }) {
  return (
    <div className="telemetry-panel">
      <div className="telemetry-row">
        <span className="telemetry-label">Latitude</span>
        <span className="mono telemetry-value">{formatCoord(location?.lat)}°</span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Longitude</span>
        <span className="mono telemetry-value">{formatCoord(location?.lng)}°</span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Accuracy</span>
        <span className="mono telemetry-value">{location?.accuracy ? `${Math.round(location.accuracy)}m` : '—'}</span>
      </div>
      <div className="telemetry-row">
        <span className="telemetry-label">Last update</span>
        <span className="mono telemetry-value">{timeAgo(lastSeenAt || location?.timestamp)}</span>
      </div>
    </div>
  );
}
